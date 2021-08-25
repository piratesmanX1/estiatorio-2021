import axios from 'axios';
import { useState, useEffect, useRef } from "react";
import { Link, useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoadingBar from "react-top-loading-bar";
import { useSnackbar } from 'notistack';

import Cookies from 'js-cookie'
import { destroyCookies } from '../functions/destroyCookies'

// MaterialUI
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import {
    Grid,
    Card,
    CardHeader,
    CardActions,
    CardContent,
    Divider,
    Typography
} from '@material-ui/core';
import { TextField } from "@material-ui/core";

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    root: {
      height: '100vh',
      backgroundImage: 'url(./assets/image/B06.jpg)',
      backgroundRepeat: 'no-repeat',
      backgroundColor:
        theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      justifyContent: "center",
      padding: "60px 30px",
      paddingTop: "95px"
    },
    cardHeader: {
        fontSize: "22px",
        position: "relative",
        padding: "20px"
    },
    cardHeaderTitle: {
        margin: "unset"
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}));


const ResetPwContent = () => {
    const classes = useStyles();

    // backdrop settings
    const [loadingOpen, setLoadingOpen] = useState(false);

    const history = useHistory();
    const [progressBar, setProgressBar] = useState(0);

    const [errors, setErrors] = useState({});

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    // Defining snackbar from MaterialUI
    const { enqueueSnackbar } = useSnackbar();

    // checking the first initial render
    const firstRender = useRef(false);

    // creating error message object literals for form validation
    const validation = () => {
        let validate = {}
        validate.username = username !== "" | null | " " ? "" : "* This field is required";
        validate.email = email !== "" | null | " " ? (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email) ? "" : "* Email format is invalid" : "* This field is required";
        
        setErrors ({
            // Saving errors into the state object via seperator operator
            ...validate
        })

        // return the object of values, by using every() to validate the array with the provided function
        // if each of the values from the input delivered in validate object is valid according to the condition set within every(), then return boolean.
        return Object.values(validate).every(x => x == "") // if the object value is not empty then it will return true
    }

    useEffect(() => {
        // Perform input validation after setState(), by using custom hook and useRef
        if (firstRender.current) {
            validation();
        } else {
            firstRender.current = true;
        }
    }, [username, email])

    useEffect(() => {
        setProgressBar(100);
        // hide the navbar and footer for design concerns
        document.getElementById("estiatorio-header").classList.remove("inverted");
        document.getElementById("navbar").classList.add("hidden");
        document.getElementById("contact").classList.add("hidden");

        document.getElementById("navbar").classList.remove("removed");
        document.getElementById("contact").classList.remove("removed");

        document.title = ' Reset Password | Estiatorio ';

        // Page validation on reset password page
        if (Cookies.get("user_id")) {
            // if the user already logged in, check whether the account is active or not
            if (Cookies.get("status") == 0) {
                // if it is, proceed to redirect back to their page accordingly based on their role
                // 0: Admin = Dashboard; 1: Customer = Profile Page; 2: Staff = Dashboard
                enqueueSnackbar("Notice: You have already logged in. You may perform this action in profile page instead.", {variant: 'info'});
                history.push('/profile'); 
            } else {
                enqueueSnackbar('Your account is inactive, you are unauthorized to access this page.', {variant: 'error'});
                history.push('/'); 
                // immediately break session
                destroyCookies();
            }
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault(); // preventing the form onsubmit automatically refresh the page

        // check if the forms are validated or not
        if (validation()) {
            // if the forms have no error then proceed with request
            // Send POST request to server for obtaining the related data
            let formData = new FormData();
            
            formData.append("username", username);
            formData.append("email", email);

            const API_PATH = `http://localhost:80/APU/FYP/estiatorio/src/api/reset_password.php`; // direct it to the PHP folder

            // showing a loading backdrop page to prevent any interruption from user
            setLoadingOpen(true);

            axios.post(API_PATH, formData) // asynchronous, therefore promises
                .then((res) => {
                    // if POST is a success then output a snackbar from MaterialUI
                    if (res.data == true) {
                        setLoadingOpen(false);
                        // if the user found and resetted password to the email, display a message
                        enqueueSnackbar('Password resetted and send to the email', {variant: 'success'});
                        // then redirect to login page
                        history.push('/login'); 
                    } else {
                        setLoadingOpen(false);
                        // in this case res.data must be returning an error message
                        enqueueSnackbar(res.data, {variant: 'error'});
                    }
                })
                .catch((err) =>  {
                    setLoadingOpen(false);
                    enqueueSnackbar(err, {variant: 'error'});
                    throw Error("Error: Password reset process failed for some reason. Error: " + err); // making a custom error message that will show in console
                });
        } else {
            setLoadingOpen(false);
            // error message
            enqueueSnackbar('Error: Form is invalid, please try again', {variant: 'error'});
        }
    }

    return (
        <div className="ResetPwContent">
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
                <Grid container component="main" className={classes.root}>
                    <CssBaseline />
                    <Card className="rest-pw-content">
                        <CardContent className={classes.cardHeader}>
                            <p className={classes.cardHeaderTitle}>Reset Password</p>
                            <Typography
                                    color="textSecondary"
                                    variant="body1"
                                    stlye={{marginBottom: "3.5px!important", marginTop: "10px"}}
                            >The resetted password will send to the related email if the information of the account are accurate.
                            </Typography>
                        </CardContent>
                        <Divider />
                        <form onSubmit={handleSubmit}>
                            <CardContent style={{padding: "20px 32px"}}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <TextField 
                                        {...(errors.username && {error: true, helperText: errors.username})}
                                            name="username"
                                            id="standard-required"
                                            className="MuiInputs"
                                            label="Username"
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <TextField 
                                        {...(errors.email && {error: true, helperText: errors.email})}
                                            name="email"
                                            id="standard-email-required"
                                            className="MuiInputs"
                                            label="Email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                            <div className="login-link link-container">
                                <Link to="/login">Login &#8594;</Link>
                            </div>
                            <div className="register-link">
                                <input type="submit" value="Reset" />
                            </div>
                        </form>
                    </Card>
                </Grid>
                <Backdrop className={classes.backdrop} open={loadingOpen}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </motion.div>
        </div>
    );
}
 
export default ResetPwContent;