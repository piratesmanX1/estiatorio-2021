import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useState, useEffect, useRef } from "react";
import { useSnackbar } from 'notistack';

import { destroyCookies } from '../functions/destroyCookies'
import Cookies from 'js-cookie'

// Functions
import { validateJSON } from '../functions/validateJSON'

// Material UI
import { TextField } from "@material-ui/core";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Paper,
  Container,
  Grid,
  Avatar,
  Button,
  Card,
  CardHeader,
  CardActions,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  IconButton,
  Tooltip
} from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import BackspaceOutlinedIcon from '@material-ui/icons/BackspaceOutlined';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    profileBox: {
        textAlign: "center"
    },
    profileAction: {
        padding: "unset"
    },
    profileImg: {
        width: theme.spacing(20),
        height: theme.spacing(20),
        marginLeft: "auto",
        marginRight: "auto",
    },
    profileName: {
        marginTop: "16px",
        fontSize: "28px"
    },
    profileLists: {
        width: "100%",
        padding: "unset"
    },
    cardHeader: {
        fontSize: "22px",
        position: "relative"
    },
    cardHeaderTitle: {
        margin: "unset"
    },
    cardHeaderIcon: {
        position: "absolute",
        top: "16px",
        right: "16px",
        padding: "12px!important",
        color: "rgba(0, 0, 0, 0.54)!important",
        fontSize: "1.5rem!important",
        backgroundColor: "transparent!important",
        borderRadius: "50%"
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    saveEditBtn: {
        paddingBottom: "unset!important",
        textAlign: "right"
    }
}));

const StaffRestaurantContext = ({restaurantData, fetchRestaurant}) => {
    const classes = useStyles();

    const [editable, setEditable] = useState(false);

    // backdrop settings
    const [loadingOpen, setLoadingOpen] = useState(false);

    const history = useHistory();
    const[errors, setErrors] = useState({});

    const [image, setImage] = useState(restaurantData.restaurant_logo);
    const [restaurant_name, setRestaurant_name] = useState(restaurantData.restaurant_name);
    const [restaurant_description, setRestaurant_description] = useState(restaurantData.restaurant_description);
    const [restaurant_address, setRestaurant_address] = useState(restaurantData.restaurant_address);
    const [seat_capacity, setSeat_capacity] = useState(restaurantData.seat_capacity);
    const [region_id, setRegion_id] = useState(restaurantData.region_id);
    const [reservation_fee, setReservation_fee] = useState(restaurantData.reservation_fee);
    const [status, setStatus] = useState(restaurantData.status);

    const [region_list, setRegion_list] = useState([]);

    // checking the first initial render
    const firstRender = useRef(false);

    // Defining snackbar from MaterialUI
    const { enqueueSnackbar } = useSnackbar();

    // creating error message object literals for form validation
    const validation = () => {
        let validate = {}

        validate.image = image !== null ? "" : "* This field is required";
        validate.restaurant_name = restaurant_name !== "" | null | " " ? "" : "* This field is required";
        validate.restaurant_description = restaurant_description !== "" | null | " " ? "" : "* This field is required";
        validate.restaurant_address = restaurant_address !== "" | null | " " ? "" : "* This field is required";
        validate.region_id = region_id !== "" | null | " " ? "" : "* This field is required";
        validate.reservation_fee = reservation_fee !== "" | null | " " ? (/^(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/).test(reservation_fee) ? "" : "* Reservation fee must be in number digits with decimal only" : "* This field is required";
        
        setErrors ({
            // Saving errors into the state object via seperator operator
            ...validate
        })

        // return the object of values, by using every() to validate the array with the provided function
        // if each of the values from the input delivered in validate object is valid according to the condition set within every(), then return boolean.
        return Object.values(validate).every(x => x == "") // if the object value is not empty then it will return true
    }

    const updateRestaurant = (column_name, column_value) => {
        // check if the forms are validated or not

        // if the forms have no error then proceed with request
        // Send POST request to server for obtaining the related data
        let formData = new FormData();
        
        formData.append("column_name", column_name);
        formData.append("column_value", column_value);
        formData.append("user_id", Cookies.get("user_id"));
        formData.append("restaurant_id", restaurantData.restaurant_id);

        const API_PATH = `http://localhost:80/APU/FYP/estiatorio/src/api/update_restaurant.php`; // direct it to the PHP folder

        axios.post(API_PATH, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }) // asynchronous, therefore promises
            .then((res) => {
                // if POST is a success then output a snackbar from MaterialUI
                if (res.data == true) {
                    enqueueSnackbar("Restaurant info updated", {variant: 'success'});
                    // fetch data to refresh
                    fetchRestaurant();
                } else if ((validateJSON(res.data) == true) && (column_name == "restaurant_logo")) {
                    // if res.data return a JSON format file and the data changes was aiming at profile image                    
                    enqueueSnackbar("Restaurant info updated", {variant: 'success'});
                    fetchRestaurant();
                } else {
                    // in this case res.data must be returning an error message
                    enqueueSnackbar(res.data, {variant: 'error'});
                }
            })
            .catch((err) =>  {
                enqueueSnackbar(err, {variant: 'error'});
                throw Error("Restaurant update process failed for some reason. Error: " + err); // making a custom error message that will show in console
            });
    }

    useEffect(() => {
        // Perform input validation after setState(), by using custom hook and useRef
        if (firstRender.current) {
            validation();
        } else {
            firstRender.current = true;
        }
    }, [restaurant_name, restaurant_description, restaurant_address, reservation_fee])

    const fetchData = () => {
        const API_PATH = `http://localhost:80/APU/FYP/estiatorio/src/api/fetch_region.php`; // direct it to the PHP folder
        
        axios.post(API_PATH) // asynchronous, therefore promises
            .then((res) => {
                // if POST is a success then output a snackbar from MaterialUI
                if (res.data == false) {
                    // if user data not found
                    enqueueSnackbar('Data unable to be fetched, please try again.', {variant: 'error'});
                } else if (validateJSON(res.data) == true) {
                    // if data is in JSON format, means the user data retrieved
                    // proceed to extract the data and set it into React Session
                    let datarows = [];
                    res.data.map((data) => {
                        datarows.push({region_id: data.region_id, region_name: data.region_name});
                    });  
                    
                    setRegion_list(datarows);
                } else {
                    // in this case res.data must be returning an error message
                    enqueueSnackbar(res.data, {variant: 'error'});
                }
            })
            .catch((err) =>  {
                enqueueSnackbar(err, {variant: 'error'});
                throw Error("Error: Data fetching process failed for some reason. Error: " + err); // making a custom error message that will show in console
            });
    }

    useEffect(() => {
        // fetch the data onload
        fetchData();
    }, [])

    return (
        <div className="StaffReservationForm">
            <Card className="profile-content">
                <CardContent className={classes.cardHeader}>
                    <p className={classes.cardHeaderTitle}>Restaurant Information</p>
                    <IconButton aria-label="edit" className={`edit-icon-btn ` + classes.cardHeaderIcon} onClick={() => { editable == true ? setEditable(false) : setEditable(true) }}>
                        {!editable && 
                        <Tooltip title="Edit" aria-label="edit">
                            <EditOutlinedIcon />
                        </Tooltip>
                        }
                        {editable && 
                        <Tooltip title="Cancel" aria-label="cancel">
                            <BackspaceOutlinedIcon />
                        </Tooltip>
                        }
                    </IconButton>
                </CardContent>
                <CardContent>
                    <form enctype="multipart/form-data">
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <div className="image-upload">
                                    <label for="file-input">
                                        <div className="image-container" style={{marginBottom: "20px"}}>
                                                <img id="image-uploader" src={image ? image : `./assets/image/F01.png`}/>
                                                <input id="file-input" name="restaurant_logo" type="file" accept="image/*"  
                                                    style={{display: "none"}}
                                                    {...editable == true ? {enabled: "enabled"} : {disabled: "disabled"}}
                                                    onChange={(e) => {
                                                        if (e.target.files[0] != null) {
                                                            const reader = new FileReader();

                                                            reader.onload = () => {
                                                                const img = document.getElementById("image-uploader");
                                                                img.src = reader.result;
                                                            }
                                                            reader.readAsDataURL(e.target.files[0]);
                                                        }
                                                        setImage(e.target.files[0]);
                                                        (e.target.files[0] != null ? updateRestaurant(e.target.name, e.target.files[0]) : enqueueSnackbar("Restaurant logo is empty, please try again", {variant: 'error'}))
                                                    }
                                                }/>
                                            
                                        </div>
                                    </label>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={6}>
                                <TextField 
                                    {...(errors.restaurant_name && {error: true, helperText: errors.restaurant_name})}
                                    {...editable == true ? {enabled: "enabled"} : {disabled: "disabled"}}
                                    name="restaurant_name"
                                    style={{marginBottom: "20px"}}
                                    id="standard-required"
                                    label="Restaurant Name"
                                    type="text"
                                    value={restaurant_name}
                                    onChange={(e) => setRestaurant_name(e.target.value)}
                                    fullWidth
                                    required 
                                    onBlur={(e) => {
                                        e.target.value ? updateRestaurant(e.target.name, e.target.value) : enqueueSnackbar("Restaurant name is empty, please try again", {variant: 'error'});
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={6}>
                                <TextField 
                                    {...(errors.restaurant_description && {error: true, helperText: errors.restaurant_description})}
                                    {...editable == true ? {enabled: "enabled"} : {disabled: "disabled"}}
                                    name="restaurant_description"
                                    style={{marginBottom: "20px"}}
                                    id="standard-required"
                                    label="Restaurant Description"
                                    type="text"
                                    value={restaurant_description}
                                    onChange={(e) => setRestaurant_description(e.target.value)}
                                    fullWidth
                                    required 
                                    onBlur={(e) => {
                                        e.target.value ? updateRestaurant(e.target.name, e.target.value) : enqueueSnackbar("Restaurant description is empty, please try again", {variant: 'error'});
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={6}>
                                <TextField
                                    {...(errors.restaurant_address && {error: true, helperText: errors.restaurant_address})}
                                    {...editable == true ? {enabled: "enabled"} : {disabled: "disabled"}}
                                    name="restaurant_address"
                                    style={{marginBottom: "20px"}}
                                    id="standard-input"
                                    label="Restaurant Address"
                                    type="text"
                                    value={restaurant_address}
                                    onChange={(e) => setRestaurant_address(e.target.value)}
                                    fullWidth
                                    required
                                    onBlur={(e) => {
                                        e.target.value ? updateRestaurant(e.target.name, e.target.value) : enqueueSnackbar("Restaurant address is empty, please try again", {variant: 'error'});
                                    }}
                                />
                            </Grid>
                            <Grid className="reg-account-reservation_fee reg-account-region_id" item xs={12} sm={12} md={12} lg={6}>
                                <InputLabel style={{fontSize: "12px"}} id="demo-simple-select-label">Region *</InputLabel>
                                    <Select
                                        {...(errors.region_id && {error: true, helperText: errors.region_id})}
                                        {...editable == true ? {enabled: "enabled"} : {disabled: "disabled"}}
                                        style={{marginBottom: "20px"}}
                                        labelId="demo-simple-select-label"
                                        name="region_id"
                                        id="demo-simple-select"
                                        required
                                        fullWidth
                                        value={region_id}
                                        onChange={(e) => { setRegion_id(e.target.value); updateRestaurant(e.target.name, e.target.value)}}
                                    >
                                    {
                                        region_list.map((data) => (
                                            <MenuItem value={data.region_id}>{data.region_name}</MenuItem>
                                        )) 
                                    }
                                    </Select>
                            </Grid>
                            <Grid className="reg-account-reservation_fee" item xs={12} sm={12} md={12} lg={6}>
                                <TextField
                                    {...(errors.reservation_fee && {error: true, helperText: errors.reservation_fee})}
                                    {...editable == true ? {enabled: "enabled"} : {disabled: "disabled"}}
                                    name="reservation_fee"
                                    style={{marginBottom: "20px"}}
                                    id="standard-input"
                                    label="Reservation Fee (RM)"
                                    type="text"
                                    value={reservation_fee}
                                    onChange={(e) => setReservation_fee(e.target.value)}
                                    fullWidth
                                    required
                                    onBlur={(e) => {
                                        e.target.value ? (/^(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/).test(e.target.value) ? updateRestaurant(e.target.name, e.target.value) : enqueueSnackbar("Reservation fee can be in digit numbers only", {variant: 'error'}) : enqueueSnackbar("Reservation fee is empty, please try again", {variant: 'error'});
                                    }}
                                />
                            </Grid>
                            <Grid style={{transform: "translateY(-2.5px)"}} className="reg-account-reservation_fee" item xs={12} sm={12} md={12} lg={6}>
                                <label style={{fontSize: "12px"}} for="seat-capacity">Seat Capacity *</label>
                                <input 
                                    {...editable == true ? {enabled: "enabled"} : {disabled: "disabled"}}
                                    id="seat-capacity" 
                                    name="seat_capacity" 
                                    type="number" 
                                    style={{marginBottom: "20px", borderBottom: "1px solid"}} 
                                    step="1" min="1" 
                                    value={seat_capacity} 
                                    onChange={(e) => setSeat_capacity(e.target.value)} 
                                    required
                                    onBlur={(e) => { 
                                        (/^0*[1-9]\d*$/).test(e.target.value) ? updateRestaurant(e.target.name, e.target.value) : enqueueSnackbar("Seating capacity need to be more than 0, please try again", {variant: 'error'}) 
                                    }
                                }/>
                            </Grid>
                            <Grid className="reg-account-role reg-account-gender" item xs={12} sm={12} md={12} lg={6}>
                                <InputLabel id="demo-simple-select-label">Status *</InputLabel>
                                <Select
                                    {...editable == true ? {enabled: "enabled"} : {disabled: "disabled"}}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    name="status"
                                    required
                                    fullWidth
                                    value={status}
                                    onChange={(e) => { setStatus(e.target.value); updateRestaurant(e.target.name, e.target.value);}}
                                >
                                    <MenuItem value={0}>Active</MenuItem>
                                    <MenuItem value={1}>Deactivated</MenuItem>
                                </Select>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
            <Backdrop className={classes.backdrop} open={loadingOpen}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}
 
export default StaffRestaurantContext;