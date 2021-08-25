import axios from 'axios';
import { useState, useEffect, useRef } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { motion } from 'framer-motion';
import LoadingBar from "react-top-loading-bar";
import { useSnackbar } from 'notistack';

import Cookies from 'js-cookie'
import { destroyCookies } from '../functions/destroyCookies'

// Functions
import { pageValidation } from '../functions/pageValidation'
import { formatDate } from '../functions/formatDate'
import { validateJSON } from '../functions/validateJSON'
// md5 function in PHP version
import md5 from 'locutus/php/strings/md5';

// MaterialUI
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
import { TextField } from "@material-ui/core";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker
} from '@material-ui/pickers';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';


import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import LockOpenOutlinedIcon from '@material-ui/icons/LockOpenOutlined';
import BookmarksOutlinedIcon from '@material-ui/icons/BookmarksOutlined';
import BlockIcon from '@material-ui/icons/Block';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import SearchIcon from '@material-ui/icons/Search';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import BackspaceOutlinedIcon from '@material-ui/icons/BackspaceOutlined';
import LibraryBooksOutlinedIcon from '@material-ui/icons/LibraryBooksOutlined';
import { useTheme } from '@material-ui/core/styles';

// CSS
import '../assets/css/profile.css';

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

const RestaurantContent = () => {
    const classes = useStyles();

    const { resid } = useParams();

    // backdrop settings
    const [loadingOpen, setLoadingOpen] = useState(false);
    
    // Dialog box settings
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // handling reservation process
    const handleReserve = () => {
        // seperating into 24 hours format
        let regdate = formatDate(selectedDate);
        const resDate = new Date(selectedDate);
        let regtime = selectedDate.toLocaleTimeString('en-GB');

        // verifying the max and min time
        let min_time = new Date(2018, 11, 24, 8, 30, 0, 0);
        let max_time = new Date(2018, 11, 24, 22, 30, 0, 0);

        if (((regtime > max_time.toLocaleTimeString('en-GB')) || (regtime < min_time.toLocaleTimeString('en-GB'))) || (new Date() > resDate)) {
            enqueueSnackbar("Please do ensure the reservation time is on a valid date and between 9:30AM to 10:30PM first.", {variant: 'error'});
        } else {
            const API_PATH = `http://localhost:80/APU/FYP/estiatorio/src/api/create_reservation.php`; // direct it to the PHP folder

            let formData = new FormData();
            
            formData.append("reservation_time", reservedDate);
            formData.append("table_number", reservedSeats);
            formData.append("restaurant_id", resid);
            formData.append("user_id", Cookies.get("user_id"));

            // showing a loading backdrop page to prevent any interruption from user
            setLoadingOpen(true);
            
            axios.post(API_PATH, formData) // asynchronous, therefore promises
            .then((res) => {
                // if POST is a success then output a snackbar from MaterialUI
                if (res.data == true) {
                    // if reservation is made, tell the user via snackbar
                    setLoadingOpen(false);
                                
                    enqueueSnackbar("Reservation made, you may navigate the Reservation Log to check the status.", {variant: 'success'});
                } else {
                    // in this case res.data must be returning an error message
                    setLoadingOpen(false);
                    enqueueSnackbar(res.data, {variant: 'error'});
                }
            })
            .catch((err) =>  {
                setLoadingOpen(false);
                enqueueSnackbar(err, {variant: 'error'});
                throw Error("Reservation process failed for some reason. Error: " + err); // making a custom error message that will show in console
            });
        }
    }

    const [ region, setRegion ] = useState("-");

    // fetch region name related to the restaurant
    const fetchRestaurantRegion = (region_id) => {
        const API_PATH = `http://localhost:80/APU/FYP/estiatorio/src/api/fetch_restaurant_region.php`; // direct it to the PHP folder

        let formData = new FormData();
        
        formData.append("region_id", region_id);
   
        axios.post(API_PATH, formData) // asynchronous, therefore promises
        .then((res) => {
            // if POST is a success then output a snackbar from MaterialUI and redirect back to homepage with clearing session
            if (res.data == false) {

            } else if (validateJSON(res.data) == true) {
                res.data.map((data) => {
                    setRegion(data.region_name);
                }); 
            } else {
                // in this case res.data must be returning an error message
                enqueueSnackbar(res.data, {variant: 'error'});
            }
        })
        .catch((err) =>  {
            enqueueSnackbar(err, {variant: 'error'});
            throw Error("Region name unable to be fetched. Error: " + err); // making a custom error message that will show in console
        });
    }
    
    const [image, setImage] = useState();
    const [restaurant_name, setRestaurant_name] = useState("-");
    const [restaurant_description, setRestaurant_description] = useState("-");
    const [restaurant_address, setRestaurant_address] = useState("-");
    const [reservation_fee, setReservation_fee] = useState("-")
    const [seat_capacity, setSeat_capacity] = useState("-");
    const [status, setStatus] = useState("-")
    const [region_id, setRegion_id] = useState("-");
    const [reservedSeats, setReservedSeats] = useState(1);

    // fetch restaurant detail into the page
    const fetchRestaurantContent = () => {
        const API_PATH = `http://localhost:80/APU/FYP/estiatorio/src/api/fetch_restaurant_content.php`; // direct it to the PHP folder

        let formData = new FormData();
        
        formData.append("restaurant_id", resid);
   
        axios.post(API_PATH, formData) // asynchronous, therefore promises
        .then((res) => {
            // if POST is a success then output a snackbar from MaterialUI and redirect back to homepage with clearing session
            if (res.data == false) {
                enqueueSnackbar("Data not found, please try again.", {variant: 'error'});
                // redirect back to browse list
                history.push('/browse');
            } else if (validateJSON(res.data) == true) {
                Promise.allSettled(res.data.map(async(data) => {
                    setImage(data.restaurant_logo);
                    setRestaurant_name(data.restaurant_name);
                    setRestaurant_description(data.restaurant_description);
                    setRestaurant_address(data.restaurant_address);
                    setSeat_capacity(data.seat_capacity);
                    setReservation_fee(data.reservation_fee);
                    setStatus(data.status);
                    setRegion_id(data.region_id);
                    fetchRestaurantRegion(data.region_id);
                }));
            } else {
                // in this case res.data must be returning an error message
                enqueueSnackbar(res.data, {variant: 'error'});
                history.push('/browse');
            }
        })
        // .catch((err) =>  {
        //     enqueueSnackbar(err, {variant: 'error'});
        //     throw Error("Region name unable to be fetched. Error: " + err); // making a custom error message that will show in console
        // });
    }

    const history = useHistory();
    const [progressBar, setProgressBar] = useState(0);

    // Defining snackbar from MaterialUI
    const { enqueueSnackbar } = useSnackbar();

    // checking the first initial render
    const firstRender = useRef(false);

    useEffect(() => {
        setProgressBar(100);
        // hide the navbar and footer for design concerns
        document.getElementById("estiatorio-header").classList.remove("inverted");
        document.getElementById("navbar").classList.add("hidden");
        document.getElementById("contact").classList.add("hidden");
        document.getElementById("navbar").classList.remove("removed");
        document.getElementById("contact").classList.remove("removed");
        
        document.title = ' Restaurant Content | Estiatorio ';
    }, []);
    
    const [selectedDate, setSelectedDate] = useState(new Date(0, 0, 0, 8, 30, 0, 0));
    const [reservedDate, setReservedDate] = useState((formatDate(selectedDate) + " " + (selectedDate.toLocaleTimeString('en-GB'))));

    const handleDateChange = (date) => {
        // seperating into 24 hours format
        let regdate = formatDate(date);
        let regtime = date.toLocaleTimeString('en-GB');

        // verifying the max and min time
        let min_time = new Date(2018, 11, 24, 8, 30, 0, 0);
        let max_time = new Date(2018, 11, 24, 22, 30, 0, 0);

        if ((regtime > max_time.toLocaleTimeString('en-GB')) || (regtime < min_time.toLocaleTimeString('en-GB'))) {
            enqueueSnackbar("Please do ensure the reservation time is between 9:30AM to 10:30PM first.", {variant: 'error'});
        } else {
            setSelectedDate(date);
            regdate = regdate + " " + regtime;
            setReservedDate(regdate);
        }
    };

    const handleTimeChange = (date_time) => {
        let time = date_time.toLocaleTimeString('en-GB');
        let min_time = new Date(2018, 11, 24, 8, 30, 0, 0);
        let max_time = new Date(2018, 11, 24, 22, 30, 0, 0);
        
        if ((time > max_time.toLocaleTimeString('en-GB')) || (time < min_time.toLocaleTimeString('en-GB'))) {
            // if time is over the usual operating hour of 9:30 to 6:30 (6:30 we set it as 4:30 straightaway because of 2 hours duration consideration)
            enqueueSnackbar("Reservation time is not between the intended hour of 9:30AM to 10:30PM. Please try again.", {variant: 'error'});
        } else {
            handleDateChange(date_time);
        }
    }
    
    useEffect(() => {
        // fetch the data onload
        fetchRestaurantContent();
    }, [])

    return (
        <div className="ProfileContent RestaurantContent">
            <LoadingBar 
                color="#ffe500"
                progress={progressBar}
                onLoaderFinished={() => setProgressBar(0)}
            />
            <motion.div 
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.75}}
            >
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={8} lg={8}>
                        <Card className="profile-content">
                            <CardContent className={classes.cardHeader}>
                                <p className={classes.cardHeaderTitle}>Restaurant Information</p>
                                <Typography
                                    color="textSecondary"
                                    variant="body1"
                                >Region: { region }
                                </Typography>
                            </CardContent>
                            <Divider />
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12} md={12} lg={12} >
                                        <div class="restuarant-image" style={{maxWidth: "300px", marginRight: "auto", marginLeft: "auto"}}>
                                            <img src={ image || "./assets/image/E01.png"} style={{marginRight: "auto", marginLeft: "auto", marginBottom: "16px"}} />
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} lg={6}>
                                        <Typography
                                            color="textSecondary"
                                            variant="body1"
                                        >Seat Capacity</Typography>
                                        <p>{ seat_capacity }</p>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} lg={6}>
                                        <Typography
                                            color="textSecondary"
                                            variant="body1"
                                        >Address</Typography>
                                        <p>{ restaurant_address }</p>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} lg={6}>
                                        <Typography
                                            color="textSecondary"
                                            variant="body1"
                                        >Reservation Fee</Typography>
                                        <p>RM { reservation_fee } / per table</p>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} lg={6}>
                                        <Typography
                                            color="textSecondary"
                                            variant="body1"
                                        >Restaurant Status</Typography>
                                        <p style={status == 0 ? {color: "lime"} : {color: "red"}}>{ status == 0 ? "Active" : "Inactive" }</p>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <Typography
                                            color="textSecondary"
                                            variant="body1"
                                        >Description</Typography>
                                        <p>{ restaurant_description }</p>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Card>
                            <CardContent className={classes.cardHeader}>
                                <p className={classes.cardHeaderTitle}>Reservation</p>
                                {/* <Typography
                                    color="textSecondary"
                                    variant="body1"
                                >Role: { (Cookies.get("role") == "0") ? "Admin" : (Cookies.get("role") == "1") ? "Customer" : "Staff" }
                                </Typography> */}
                            </CardContent>
                            <Divider />
                            <CardContent>
                                <Box className={classes.profileBox}>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            {...(Cookies.get("role") == 1) ? {enabled: "enabled"} : {disabled: "disabled"}}
                                            className="register-dob MuiDateInputs"
                                            variant="inline"
                                            format="yyyy-MM-dd"
                                            margin="normal"
                                            id="date-picker-dialog"
                                            required
                                            label="Reservation Date"
                                            fullWidth
                                            value={selectedDate}
                                            onChange={handleDateChange}
                                            minDate={new Date()}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                        <KeyboardTimePicker
                                            {...(Cookies.get("role") == 1) ? {enabled: "enabled"} : {disabled: "disabled"}}
                                            margin="normal"
                                            id="time-picker"
                                            className="register-dob MuiDateInputs"
                                            label="Reservation Time"
                                            fullWidth
                                            required
                                            minutesStep={30}
                                            value={selectedDate}
                                            onChange={handleTimeChange}
                                            minTime={new Date()}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change time',
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>
                                    <div className="reserved-seats-container" style={{margin: "15px 0"}} >
                                        <label for="seat_capacity">Reserved Seats </label><br/>
                                        <input {...(Cookies.get("role") == 1) ? {enabled: "enabled"} : {disabled: "disabled"}} id="seat_capacity" name="seat_capacity" type="number" step="1" min="1" max="5" value={reservedSeats} onChange={(e) => {setReservedSeats(e.target.value)}} />
                                    </div>
                                    <Typography
                                            color="textSecondary"
                                            className="reservation-caption"
                                            variant="body1"
                                            stlye={{marginBottom: "3.5px!important"}}
                                    >* Any reservation made will be considered to have 2 hours duration at max, therefore the latest reservation that will be accepted is 10:30PM.
                                    </Typography>
                                    {
                                        (Cookies.get("role") == 1) ?
                                            <input onClick={handleReserve} style={{width: "100%", margin: "22px 0"}} type="submit" className="elementor-button-link elementor-button elementor-size-sm" value="RESERVE" />
                                        :
                                            ""
                                    }
                                </Box>
                            </CardContent>
                            <Divider />
                            <CardActions className={`profile-list-container ` + classes.profileAction}>
                                <List component="nav" aria-label="main mailbox folders" className={`profile-list ` + classes.profileLists}>
                                    <ListItem button onClick={() => { document.getElementById("home-link").click(); }}>
                                        <ListItemIcon>
                                            <HomeOutlinedIcon />
                                        </ListItemIcon>
                                        <ListItemText>
                                            <Link id="home-link" to="/">Home</Link>
                                        </ListItemText>
                                    </ListItem>
                                    {(Cookies.get("role") == 1) ?
                                    <ListItem button onClick={() => { document.getElementById("reservation-log-link").click(); }}>
                                        <ListItemIcon>
                                            <BookmarksOutlinedIcon />
                                        </ListItemIcon>
                                        <ListItemText>
                                            <Link id="reservation-log-link" to={`/log/${Cookies.get("user_id")}`}>Reservation Log</Link>
                                        </ListItemText>
                                    </ListItem>
                                    : ""
                                    }
                                    <Divider />
                                    <ListItem button onClick={() => { document.getElementById("browse-link").click(); }}>
                                        <ListItemIcon>
                                            <SearchIcon />
                                        </ListItemIcon>
                                        <ListItemText>
                                            <Link id="browse-link" to={`/browse`}>Back to Browsing</Link>
                                        </ListItemText>
                                    </ListItem>
                                    <Divider />

                                    {/* <ListItem button onClick={handleClickOpen}>
                                        <ListItemIcon>
                                            <BlockIcon />
                                        </ListItemIcon>
                                        <ListItemText>
                                            <a>{Cookies.get("status") == "0" ? "Deactivate Account" : "Activate Account"}</a>
                                        </ListItemText>
                                    </ListItem> */}
                                    {/* <Dialog
                                        className="account-status-dialog"
                                        fullScreen={fullScreen}
                                        open={open}
                                        onClose={handleClose}
                                        aria-labelledby="responsive-dialog-title"
                                    >
                                        <DialogTitle id="responsive-dialog-title">{`Are you sure you want to ` + (Cookies.get("status") == "0" ? "deactivate" : "activate") + ` your account?`}</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText>
                                                This action is irreversible, and if you wish to reverse it in the future you will have to contact with the administrator. <br/>
                                                <div>{(Cookies.get("role") == "2" ? "Any reservation or restaurant under this account will be cancelled/deactivated in response of this action. Estiatorio will not held any liability from any possible losses caused by this action." : Cookies.get("role") == "1" ? "Any reservation made under this account will be cancelled in response of this action. Estiatorio will not held any liability from any possible losses caused by this action." : "")}</div>
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button autoFocus onClick={handleClose} color="primary">
                                                Cancel
                                            </Button>
                                            <Button color="primary" autoFocus>
                                                Proceed
                                            </Button>
                                        </DialogActions>
                                    </Dialog> */} 
                                </List>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
                <Backdrop className={classes.backdrop} open={loadingOpen}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </motion.div>
        </div>
    );
}
 
export default RestaurantContent;