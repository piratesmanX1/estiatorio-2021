import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { useState, useEffect, useRef } from "react";
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie'

// Functions
import { validateJSON } from '../functions/validateJSON'
import { destroyCookies } from '../functions/destroyCookies'

// Material UI
import { TextField } from "@material-ui/core";

const LoginForm = ({setLogin, login}) => {
    const history = useHistory();
    const [errors, setErrors] = useState({});

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // checking the first initial render
    const firstRender = useRef(false);

    // Defining snackbar from MaterialUI
    const { enqueueSnackbar } = useSnackbar();

    // creating error message object literals for form validation
    const validation = () => {
        let validate = {}

        validate.username = username !== "" | null | " " ? "" : "* This field is required";
        validate.password = password !== "" | null | " " ? "" : "* This field is required";

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
            // if the forms have no error then proceed with request
            // Send POST request to server for obtaining the related data
            let formData = new FormData();
            
            formData.append("username", username);
            formData.append("password", password);

            const API_PATH = `http://localhost:80/APU/FYP/estiatorio/src/api/login.php`; // direct it to the PHP folder

            axios.post(API_PATH, formData) // asynchronous, therefore promises
                .then((res) => {
                    // if POST is a success then output a snackbar from MaterialUI
                    if (res.data == false) {
                        // if user data not found
                        enqueueSnackbar('Username or password is wrong, please try again.', {variant: 'error'});
                    } else if (validateJSON(res.data) == true) {
                        // if data is in JSON format, means the user data retrieved
                        // proceed to extract the data and set it into React Session
                        Promise.allSettled(res.data.map(async(data) => {
                            Cookies.set("user_id", data.user_id);
                            Cookies.set("profile_image", data.profile_image);
                            Cookies.set("username", data.username);
                            Cookies.set("password", data.password);
                            Cookies.set("email", data.email);
                            Cookies.set("first_name", data.first_name);
                            Cookies.set("last_name", data.last_name);
                            Cookies.set("phone_number", data.phone_number);
                            Cookies.set("dob", data.dob);
                            Cookies.set("role", data.role);
                            Cookies.set("status", data.status);
                            Cookies.set("registered_date", data.registered_date);
                            Cookies.set("gender", data.gender);
                            Cookies.set("last_login", data.last_login);
                        })).then(() => {
                             // check if the user_id has been defined within the session, then login is a success
                            if (Cookies.get("user_id")) {
                                enqueueSnackbar("Logged in", {variant: 'success'});
                                // redirect the user to their specified destination based on their role
                                if (Cookies.get("role") == "0") {
                                    history.push('/dashboard');
                                } else if (Cookies.get("role") == "1") {
                                    history.push('/profile');
                                } else {
                                    history.push('/dashboard');
                                }
                                setLogin(login => login + 1);
                            } else {
                                destroyCookies();
                                enqueueSnackbar("Error: Login failed, please try again.", {variant: 'error'});
                            }
                        });  
                    } else {
                        // in this case res.data must be returning an error message
                        enqueueSnackbar(res.data, {variant: 'error'});
                    }
                })
                .catch((err) =>  {
                    enqueueSnackbar(err, {variant: 'error'});
                    throw Error("Error: Login process failed for some reason. Error: " + err); // making a custom error message that will show in console
                });
        } else {
            // error message
            enqueueSnackbar('Error: Form is invalid, please try again', {variant: 'error'});
        }
    }

    useEffect(() => {
        // Perform input validation after setState(), by using custom hook and useRef
        if (firstRender.current) {
            validation();
        } else {
            firstRender.current = true;
        }
    }, [username, password])

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
            <form onSubmit={handleSubmit}>
                <h1>Sign In</h1>
                <TextField 
                    {...(errors.username && {error: true, helperText: errors.username})}
                    id="standard-required"
                    label="Username"
                    type="text"
                    fullWidth
                    required 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    {...(errors.password && {error: true, helperText: errors.password})}
                    id="standard-password-input"
                    label="Password"
                    type="password"
                    fullWidth
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="reset-pw-link">
                    <Link to="/reset-password">Forgot Password</Link>
                </div>
                <input type="submit" className="elementor-button-link elementor-button elementor-size-sm" value="login" />
            </form>
        </div>
    );
}
 
export default LoginForm;