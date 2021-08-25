import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useState, useEffect, useRef } from "react";
import { useSnackbar } from 'notistack';

import { destroyCookies } from '../functions/destroyCookies'
import Cookies from 'js-cookie'

// Functions
import { validateJSON } from '../functions/validateJSON'

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
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
import {
    Card,
    CardHeader,
    CardActions,
    CardContent
  } from '@material-ui/core';
// Functions
import { formatDate } from '../functions/formatDate'

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}));

const StaffRestaurantForm = ({fetchRestaurant}) => {
    const classes = useStyles();

    // backdrop settings
    const [loadingOpen, setLoadingOpen] = useState(false);

    const history = useHistory();
    const[errors, setErrors] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [image, setImage] = useState(null);
    const [restaurant_name, setRestaurant_name] = useState("");
    const [restaurant_description, setRestaurant_description] = useState("");
    const [restaurant_address, setRestaurant_address] = useState("");
    const [region_id, setRegion_id] = useState(0);
    const [reservation_fee, setReservation_fee] = useState(0);
    const [seat_capacity, setSeat_capacity] = useState(1);

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
        validate.seat_capacity = seat_capacity !== "" | null | " " ? (/^0*[1-9]\d*$/).test(seat_capacity) ? "" : "* Seating capacity need to be more than 0, please try again" : "* This field is required";
        setErrors ({
            // Saving errors into the state object via seperator operator
            ...validate
        })

        // return the object of values, by using every() to validate the array with the provided function
        // if each of the values from the input delivered in validate object is valid according to the condition set within every(), then return boolean.
        return Object.values(validate).every(x => x == "") // if the object value is not empty then it will return true
    }

    const handleSubmit = (e) => {
        e.preventDefault(); // preventing the form onsubmit automatically refresh the page

        // check if the forms are validated or not
        if (validation()) {
            // showing a loading backdrop page to prevent any interruption from user
            setLoadingOpen(true);

            // if the forms have no error then proceed with request
            // Send POST request to server for obtaining the related data
            let formData = new FormData();
            
            formData.append("image",  image);
            formData.append("restaurant_name", restaurant_name);
            formData.append("restaurant_description", restaurant_description);
            formData.append("restaurant_address", restaurant_address);
            formData.append("reservation_fee", reservation_fee);
            formData.append("seat_capacity", seat_capacity);
            formData.append("region_id", region_id);
            formData.append("user_id", Cookies.get("user_id"));
            
            const API_PATH = `http://localhost:80/APU/FYP/estiatorio/src/api/restaurant_registration.php`; // direct it to the PHP folder

            axios.post(API_PATH, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }) // asynchronous, therefore promises
                .then((res) => {
                    // if POST is a success then output a snackbar from MaterialUI
                    if (res.data == true) {
                        // if the registration succeed, close the backdrop
                        setLoadingOpen(false);
                        enqueueSnackbar('Restaurant info registered', {variant: 'success'});
                        // reload the data
                        fetchRestaurant();
                    } else {
                        setLoadingOpen(false);
                        // if the process is not a success, retrieve the message and output via snackbar
                        enqueueSnackbar(res.data, {variant: 'error'});
                    }
                })
                .catch((err) =>  {
                    setLoadingOpen(false);
                    enqueueSnackbar(err, {variant: 'error'});
                    throw Error("Registration process failed for some reason. Error: " + err); // making a custom error message that will show in console
                });
        } else {
            setLoadingOpen(false);
            // error message
            enqueueSnackbar('Form is invalid, please try again', {variant: 'error'});
        }
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
                    <p className={classes.cardHeaderTitle}>Restaurant Registration</p>
                </CardContent>
                <CardContent>
                    <form onSubmit={handleSubmit} enctype="multipart/form-data">
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <div className="image-upload">
                                    <label for="file-input">
                                        <div className="image-container" style={{marginBottom: "20px"}}>
                                                <img id="image-uploader" src="./assets/image/F01.png"/>
                                                <input id="file-input" type="file" accept="image/*" 
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
                                                    }
                                                }/>
                                            
                                        </div>
                                    </label>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={6}>
                                <TextField 
                                    style={{marginBottom: "20px"}}
                                    {...(errors.restaurant_name && {error: true, helperText: errors.restaurant_name})}
                                    id="standard-required"
                                    label="Restaurant Name"
                                    type="text"
                                    value={restaurant_name}
                                    onChange={(e) => setRestaurant_name(e.target.value)}
                                    fullWidth
                                    required 
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={6}>
                                <TextField 
                                    style={{marginBottom: "20px"}}
                                    {...(errors.restaurant_description && {error: true, helperText: errors.restaurant_description})}
                                    id="standard-required"
                                    label="Restaurant Description"
                                    type="text"
                                    value={restaurant_description}
                                    onChange={(e) => setRestaurant_description(e.target.value)}
                                    fullWidth
                                    required 
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={6}>
                                <TextField
                                    style={{marginBottom: "20px"}}
                                    {...(errors.restaurant_address && {error: true, helperText: errors.restaurant_address})}
                                    id="standard-input"
                                    label="Restaurant Address"
                                    type="text"
                                    value={restaurant_address}
                                    onChange={(e) => setRestaurant_address(e.target.value)}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid className="reg-account-reservation_fee reg-account-region_id" item xs={12} sm={12} md={12} lg={6}>
                                <InputLabel id="demo-simple-select-label">Region *</InputLabel>
                                    <Select
                                        style={{marginBottom: "20px"}}
                                        {...(errors.region_id && {error: true, helperText: errors.region_id})}
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        required
                                        fullWidth
                                        value={region_id}
                                        onChange={(e) => setRegion_id(e.target.value)}
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
                                    style={{marginBottom: "20px"}}
                                    {...(errors.reservation_fee && {error: true, helperText: errors.reservation_fee})}
                                    id="standard-input"
                                    label="Reservation Fee (RM)"
                                    type="text"
                                    value={reservation_fee}
                                    onChange={(e) => setReservation_fee(e.target.value)}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid style={{transform: "translateY(-2.5px)"}} className="reg-account-reservation_fee" item xs={12} sm={12} md={12} lg={6}>
                                <label style={{fontSize: "12px"}} for="seat-capacity">Seat Capacity *</label>
                                <input 
                                    id="seat-capacity" 
                                    name="seat_capacity" 
                                    type="number" 
                                    style={{marginBottom: "20px", borderBottom: "1px solid"}} 
                                    step="1" min="1" 
                                    value={seat_capacity} 
                                    onChange={(e) => setSeat_capacity(e.target.value)} 
                                    required
                                    onBlur={(e) => (/^0*[1-9]\d*$/).test(e.target.value) ? "" : enqueueSnackbar("Seating capacity need to be more than 0, please try again", {variant: 'error'})}
                                />
                            </Grid>
                        </Grid>
                        <input style={{marginTop: "24px", width: "unset"}} type="submit" className="elementor-button-link elementor-button elementor-size-sm" value="Register" />
                    </form>
                </CardContent>
            </Card>
            <Backdrop className={classes.backdrop} open={loadingOpen}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}
 
export default StaffRestaurantForm;