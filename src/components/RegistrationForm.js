import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useState, useEffect, useRef } from "react";
import { useSnackbar } from 'notistack';

import { destroyCookies } from '../functions/destroyCookies'
import Cookies from 'js-cookie'

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

// Functions
import { formatDate } from '../functions/formatDate'

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}));

const RegistrationForm = () => {
    const classes = useStyles();

    // backdrop settings
    const [loadingOpen, setLoadingOpen] = useState(false);

    const history = useHistory();
    const[errors, setErrors] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [image, setImage] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [gender, setGender] = useState(0);
    const [role, setRole] = useState(1);

    // checking the first initial render
    const firstRender = useRef(false);

    const handleDateChange = (date) => {
        let regdate = formatDate(date);
        regdate += " 00:00:00"
        setSelectedDate(regdate);
    };
    // Defining snackbar from MaterialUI
    const { enqueueSnackbar } = useSnackbar();

    // creating error message object literals for form validation
    const validation = () => {
        let validate = {}

        validate.image = image !== null ? "" : "* This field is required";
        validate.username = username !== "" | null | " " ? (/^\S+$/).test(username) ? "" : "* No whitespace allowed" : "* This field is required";
        validate.password = password !== "" | null | " " ? (/^\S+$/).test(password) ? "" : "* No whitespace allowed" : "* This field is required";
        validate.firstName = firstName !== "" | null | " " ? "" : "* This field is required";
        validate.lastName = lastName !== "" | null | " " ? "" : "* This field is required";
        validate.email = email !== "" | null | " " ? (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email) ? "" : "* Email format is invalid" : "* This field is required";
        validate.phoneNo = phoneNo !== "" | null | " " ? (/^[0-9]+$/).test(phoneNo) ? "" : "* Phone number must be digits only" : "* This field is required";
        validate.selectedDate = selectedDate !== "" | null | " " ? (new Date().getFullYear() - new Date(selectedDate).getFullYear()) > 18 ? "" : "* Age must be greater than 18 years old" : "* This field is required";
        validate.gender = gender !== "" | null | " " ? "" : "* This field is required";
        validate.role = role !== "" | null | " " ? "" : "* This field is required";
        
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
            formData.append("username", username);
            formData.append("password", password);
            formData.append("firstName", firstName);
            formData.append("lastName", lastName);
            formData.append("email", email);
            formData.append("phoneNo", phoneNo);
            formData.append("gender", gender);
            formData.append("role", role);
            formData.append("selectedDate", selectedDate);

            const API_PATH = `http://localhost:80/APU/FYP/estiatorio/src/api/registration.php`; // direct it to the PHP folder

            axios.post(API_PATH, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }) // asynchronous, therefore promises
                .then((res) => {
                    // if POST is a success then output a snackbar from MaterialUI
                    if (res.data == true) {
                        if (role == 1) {
                            // trigger the mail.php on notifying the user regarding the registration on the site as well
                            let subscriptionForm = new FormData();
    
                            subscriptionForm.append("fullName", lastName + " " + firstName);
                            subscriptionForm.append("email", email);
                            subscriptionForm.append("subject", 0);
                            
                            const API_PATH = `http://localhost:80/APU/FYP/estiatorio/src/api/mail.php`; // direct it to the PHP folder

                            axios.post(API_PATH, subscriptionForm) // asynchronous, therefore promises
                                .then((res) => {
                                    // if the registration succeed, close the backdrop
                                    setLoadingOpen(false);

                                    enqueueSnackbar('Account Registered', {variant: 'success'});
                                    // redirect to login page
                                    history.push('/login');
                                })
                                .catch((err) =>  {
                                    enqueueSnackbar(err, {variant: 'error'});
                                    throw Error("Mailer Error: " + err); // making a custom error message that will show in console
                                });
                        } else {
                            setLoadingOpen(false);
                            enqueueSnackbar('Staff account registration requested', {variant: 'success'});
                        }
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
    }, [username, password, firstName, lastName, email, phoneNo, role, selectedDate])

    useEffect(() => {
        // Page validation on login and registration page
        if (Cookies.get("user_id")) {
            // if the user already logged in, check whether the account is active or not
            if (Cookies.get("status") == 0) {
                // if it is, proceed to redirect back to their page accordingly based on their role
                // 0: Admin = Dashboard; 1: Customer = Profile Page; 2: Staff = Dashboard
                enqueueSnackbar("Notice: You have already logged in", {variant: 'info'});
                if (Cookies.get("role") == 0) {
                    history.push('/dashboard'); 
                } else if (Cookies.get("role") == 1) {
                    history.push('/profile'); 
                } else {
                    history.push('/dashboard'); 
                }
            } else {
                enqueueSnackbar('Your account is inactive, you are unauthorized to access this page.', {variant: 'error'});
                history.push('/'); 
                // immediately break session
                destroyCookies();
            }
        }
    }, [])

    return (
        <div className="login-form">
            <form onSubmit={handleSubmit} enctype="multipart/form-data">
                <h1>Registration</h1>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <div className="image-upload">
                            <label for="file-input">
                                <div className="image-container">
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
                            {...(errors.username && {error: true, helperText: errors.username})}
                            id="standard-required"
                            label="Username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            fullWidth
                            required 
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={6}>
                        <TextField
                            {...(errors.password && {error: true, helperText: errors.password})}
                            id="standard-password-input"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={6}>
                        <TextField 
                            {...(errors.firstName && {error: true, helperText: errors.firstName})}
                            id="standard-required"
                            label="First Name"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            fullWidth
                            required 
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={6}>
                        <TextField
                            {...(errors.lastName && {error: true, helperText: errors.lastName})}
                            id="standard-input"
                            label="Last Name"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={6}>
                        <TextField 
                            {...(errors.email && {error: true, helperText: errors.email})}
                            id="standard-email-required"
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            required 
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={6}>
                        <TextField
                            {...(errors.phoneNo && {error: true, helperText: errors.phoneNo})}
                            id="standard-input"
                            label="Phone No."
                            type="tel"
                            value={phoneNo}
                            inputProps={{ maxLength: 12 }}
                            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                            onChange={(e) => setPhoneNo(e.target.value)}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={6}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                {...(errors.selectedDate && {error: true, helperText: errors.selectedDate})}
                                className="register-dob"
                                variant="inline"
                                format="yyyy-MM-dd"
                                margin="normal"
                                id="date-picker-dialog"
                                required
                                label="Day of Birth"
                                fullWidth
                                value={selectedDate}
                                onChange={handleDateChange}
                                maxDate={new Date()}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid className="reg-account-role reg-account-gender" item xs={12} sm={12} md={12} lg={6}>
                        <InputLabel id="demo-simple-select-label">Gender *</InputLabel>
                        <Select
                            {...(errors.gender && {error: true, helperText: errors.gender})}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            required
                            fullWidth
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <MenuItem value={0}>Male</MenuItem>
                            <MenuItem value={1}>Female</MenuItem>
                            <MenuItem value={2}>Others</MenuItem>
                        </Select>
                    </Grid>
                    <Grid className="reg-account-role" item xs={12} sm={12} md={12} lg={12}>
                        <InputLabel id="demo-simple-select-label">Application Role *</InputLabel>
                        <Select
                            {...(errors.role && {error: true, helperText: errors.role})}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            required
                            fullWidth
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <MenuItem value={1}>Customer</MenuItem>
                            <MenuItem value={2}>Restaurant Staff</MenuItem>
                        </Select>
                    </Grid>
                </Grid>
                <input type="submit" className="elementor-button-link elementor-button elementor-size-sm" value="Register" />
            </form>
            <Backdrop className={classes.backdrop} open={loadingOpen}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}
 
export default RegistrationForm;