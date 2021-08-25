import axios from 'axios';
import { useState, useEffect, useRef } from "react";
import { Link, useHistory } from 'react-router-dom';
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
  KeyboardDatePicker
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

const ProfileContent = ({setLogin, login}) => {
    const classes = useStyles();

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

    // handling account status
    const handleAccStatus = () => {
        const API_PATH = `http://localhost:80/APU/FYP/estiatorio/src/api/account_status.php`; // direct it to the PHP folder

        let formData = new FormData();
        
        formData.append("user_id", Cookies.get("user_id"));
        formData.append("decider_id", Cookies.get("user_id"));

        // if the account status is 1: inactive or 2: pending approval, then the changes attempt must be activate
        if ((Cookies.get("status") == "1") || (Cookies.get("status") == "2")) {
            formData.append("status", 0);
        } else {
            // else it must be aiming for deactivation
            formData.append("status", 1);
        }

        // showing a loading backdrop page to prevent any interruption from user
        setLoadingOpen(true);
        // close the dialog
        setOpen(false);
        
        axios.post(API_PATH, formData) // asynchronous, therefore promises
        .then((res) => {
            // if POST is a success then output a snackbar from MaterialUI and redirect back to homepage with clearing session
            if (res.data == true) {
                // if the account status successfully changed, send an email to the user
                const API_PATH = `http://localhost:80/APU/FYP/estiatorio/src/api/mail.php`; // direct it to the PHP folder

                let formData = new FormData();

                formData.append("bool", (Cookies.get("status") == "0" ? "1" : "0"));
                formData.append("email", Cookies.get("email"));
                formData.append("subject", 1);

                axios.post(API_PATH, formData) // asynchronous, therefore promises
                        .then((res) => {
                            // if the mail has been send, then the account status changes completed
                            setLoadingOpen(false);
                            
                            enqueueSnackbar('Account ' + (Cookies.get("status") == "0" ? "deactivated" : "activated"), {variant: 'success'});
                            
                            // break session and redirect back to homepage
                            destroyCookies();
                            setLogin(login => login + 1);
                            history.push('/');
                        })
                        .catch((err) =>  {
                            setLoadingOpen(false);
                            enqueueSnackbar(err, {variant: 'error'});
                            throw Error("Mailer Error: " + err); // making a custom error message that will show in console
                        });
            } else {
                setLoadingOpen(false);
                // in this case res.data must be returning an error message
                enqueueSnackbar(res.data, {variant: 'error'});
            }
        })
        .catch((err) =>  {
            setLoadingOpen(false);
            enqueueSnackbar(err, {variant: 'error'});
            throw Error("Account status changing process failed for some reason. Error: " + err); // making a custom error message that will show in console
        });
    }

    // logout dialog
    const [logoutOpen, setLogoutOpen] = useState(false);
    const handleLogoutClose = () => {
        setLogoutOpen(false);
    };
    const handleClickLogoutOpen = () => {
        setLogoutOpen(true);
    };

    const handleLogoutAction = () => {
        setLogoutOpen(false);
        destroyCookies();
        enqueueSnackbar("Logged out", {variant: 'success'});
        setLogin(login => login + 1);
        history.push('/');
    }

    // reset pw dialog
    const [resetPwOpen, setResetPwOpen] = useState(false);
    const handleResetPwClose = () => {
        setResetPwOpen(false);
    };
    const handleClickResetPwOpen = () => {
        setResetPwOpen(true);
    };
    
    // handling reset password
    const handleResetPw = () => {
        const API_PATH = `http://localhost:80/APU/FYP/estiatorio/src/api/reset_password.php`; // direct it to the PHP folder

        let formData = new FormData();
        
        formData.append("username", Cookies.get("username"));
        formData.append("email", Cookies.get("email"));

        // showing a loading backdrop page to prevent any interruption from user
        setLoadingOpen(true);
        setResetPwOpen(false);

        axios.post(API_PATH, formData) // asynchronous, therefore promises
            .then((res) => {
                // if POST is a success then output a snackbar from MaterialUI and redirect back to homepage with clearing session
                if (res.data == true) {
                    setLoadingOpen(false);

                    enqueueSnackbar("Password resetted", {variant: 'success'});

                    destroyCookies();

                    // redirect to login page
                    history.push('/login');
                } else {
                    // in this case res.data must be returning an error message
                    enqueueSnackbar(res.data, {variant: 'error'});
                }
            })
            .catch((err) =>  {
                enqueueSnackbar(err, {variant: 'error'});
                throw Error("Account password resetting process failed for some reason. Error: " + err); // making a custom error message that will show in console
            });
        setLogin(login => login + 1);
    }

    // handling profile information changes
    const handleUpdateProfile = (column_name, column_value) => {
        const API_PATH = `http://localhost:80/APU/FYP/estiatorio/src/api/update_profile.php`; // direct it to the PHP folder

        let formData = new FormData();

        // making the update query dynamic 
        if (column_name == "new_password") {
            column_name = "password";
        }
        formData.append("column_name", column_name);
        formData.append("column_value", column_value);
        formData.append("user_id", Cookies.get("user_id"));
        setLoadingOpen(true);
        axios.post(API_PATH, formData) // asynchronous, therefore promises
            .then((res) => {
                // if POST is a success then output a snackbar from MaterialUI
                if (res.data == true) {
                    enqueueSnackbar("Profile info updated", {variant: 'success'});
                    // update the related session data as well
                    if (column_name == "password") {
                        column_value = md5(column_value);
                    }

                    Cookies.set(column_name, column_value);
                    setLogin(login => login + 1);
                } else if ((validateJSON(res.data) == true) && (column_name == "profile_image")) {
                    // if res.data return a JSON format file and the data changes was aiming at profile image
                    Cookies.set(column_name, res.data.profile_image);
                    
                    enqueueSnackbar("Profile info updated", {variant: 'success'});
                    setLogin(login => login + 1);
                } else {
                    // in this case res.data must be returning an error message
                    enqueueSnackbar(res.data, {variant: 'error'});
                }
            })
            .catch((err) =>  {
                enqueueSnackbar(err, {variant: 'error'});
                throw Error("Account info update failed for some reason. Error: " + err); // making a custom error message that will show in console
            });
        setLoadingOpen(false);
    }

    const history = useHistory();
    const [progressBar, setProgressBar] = useState(0);

    const [errors, setErrors] = useState({});
    const [editable, setEditable] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date(Cookies.get("dob")));

    const [image, setImage] = useState(Cookies.get("profile_image"));
    const [username, setUsername] = useState(Cookies.get("username"));
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [firstName, setFirstName] = useState(Cookies.get("first_name"));
    const [lastName, setLastName] = useState(Cookies.get("last_name"));
    const [email, setEmail] = useState(Cookies.get("email"));
    const [phoneNo, setPhoneNo] = useState(Cookies.get("phone_number"));
    const [gender, setGender] = useState(Cookies.get("gender"));

    // Defining snackbar from MaterialUI
    const { enqueueSnackbar } = useSnackbar();

    // checking the first initial render
    const firstRender = useRef(false);

    const handleDateChange = (date) => {
        let regdate = formatDate(date);
        regdate += " 00:00:00"
        setSelectedDate(regdate);

        if ((new Date().getFullYear() - new Date(regdate).getFullYear()) > 18 ) {
            handleUpdateProfile(document.querySelector("#date-picker-dialog").name, regdate);
        } else {
            enqueueSnackbar("Day of Birth must be greater than 18 years old", {variant: 'error'});
        }
    };

    // creating error message object literals for form validation
    const validation = () => {
        let validate = {}
        
        validate.email = email !== "" | null | " " ? (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email) ? "" : "* Email format is invalid" : "";
        validate.newPassword = password !== "" | null | " " ? md5(password) != Cookies.get("password") ? "* Current password is invalid" : (/^\S+$/).test(newPassword) ? "" : "* No whitespace allowed in the password" : "* You have to input current password in order to update new password"
        validate.phoneNo = phoneNo !== "" | null | " " ? (/^[0-9]+$/).test(phoneNo) ? "" : "* Phone number must be digits only" : "";
        validate.selectedDate = selectedDate !== "" | null | " " ? (new Date().getFullYear() - new Date(selectedDate).getFullYear()) > 18 ? "" : "* Age must be greater than 18 years old" : "";
        
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
    }, [username, password, newPassword, firstName, lastName, email, phoneNo, selectedDate])
    
    useEffect(() => {
        setProgressBar(100);
        // hide the navbar and footer for design concerns
        document.getElementById("estiatorio-header").classList.remove("inverted");
        document.getElementById("navbar").classList.add("hidden");
        document.getElementById("contact").classList.add("hidden");
        document.getElementById("navbar").classList.remove("removed");
        document.getElementById("contact").classList.remove("removed");
        
        document.title = ' Profile | Estiatorio ';

        // Page validation on profile page
        if (pageValidation() != true) {
            // if user has not logged in yet
            enqueueSnackbar(pageValidation(), {variant: 'error'});
            history.push('/');
        }
    }, []);
    
    // console.log(Cookies.get("user_id"),
    // Cookies.get("profile_image"),
    // Cookies.get("username"),
    // Cookies.get("password"),
    // Cookies.get("email"),
    // Cookies.get("first_name"),
    // Cookies.get("last_name"),
    // Cookies.get("phone_number"),
    // Cookies.get("dob"),
    // Cookies.get("role"),
    // Cookies.get("status"),
    // Cookies.get("registered_date"),
    // Cookies.get("gender"), pageValidation())

    return (
        <div className="ProfileContent">
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
                    <Grid item xs={12} sm={12} md={4} lg={3}>
                        <Card>
                            <CardContent>
                                <Box className={classes.profileBox}>
                                    <div className="image-upload">
                                        <label for="file-input">
                                            <div className={`image-container ` + (editable == true ? "editable" : "")}>
                                                    <Avatar
                                                        id="image-uploader"
                                                        src={Cookies.get("profile_image")}
                                                        srcSet={image}
                                                        className={classes.profileImg}
                                                        alt={Cookies.get("first_name")}
                                                    />
                                                    { editable == true ? <input name="profile_image" id="file-input" type="file" accept="image/*" 
                                                        disable={editable == true ? "false" : "true"}
                                                        onChange={
                                                            (e) => {
                                                                if (e.target.files[0] != null) {
                                                                    const reader = new FileReader();

                                                                    reader.onload = () => {
                                                                        const img = document.getElementsByClassName("MuiAvatar-img")[0];
                                                                        img.src = reader.result;
                                                                    }
                                                                    reader.readAsDataURL(e.target.files[0]);
                                                                }
                                                                setImage(e.target.files[0]);
                                                                // update the profile image if its not null
                                                                (e.target.files[0] != null ? handleUpdateProfile(e.target.name, e.target.files[0]) : enqueueSnackbar("Profile image is empty, please try again", {variant: 'error'}));
                                                            }
                                                    }/> : ""}
                                            </div>
                                        </label>
                                    </div>
                                    <Typography
                                        color="textPrimary"
                                        gutterBottom
                                        className={classes.profileName}
                                    >
                                        {Cookies.get("first_name") + " " + Cookies.get("last_name")}
                                    </Typography>
                                    <Typography
                                        color="textSecondary"
                                        variant="body1"
                                    >Registered Date: <br/>
                                        {Cookies.get("registered_date") ? Cookies.get("registered_date").substr(0, 10) : "-"}
                                    </Typography>
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
                                    {Cookies.get("role") == "1" ? 
                                    <ListItem button onClick={() => { document.getElementById("reservation-log-link").click(); }}>
                                        <ListItemIcon>
                                            <BookmarksOutlinedIcon />
                                        </ListItemIcon>
                                        <ListItemText>
                                            <Link id="reservation-log-link" to={`/log/${Cookies.get("user_id")}`}>Reservation Log</Link>
                                        </ListItemText>
                                    </ListItem>
                                    :
                                    <ListItem button onClick={() => { document.getElementById("reservation-log-link").click(); }}>
                                        <ListItemIcon>
                                            <LibraryBooksOutlinedIcon />
                                        </ListItemIcon>
                                        <ListItemText>
                                            <Link id="reservation-log-link" to="/dashboard">Dashboard</Link>
                                        </ListItemText>
                                    </ListItem>
                                    }
                                    <Divider />
                                    <ListItem button onClick={handleClickResetPwOpen}>
                                        <ListItemIcon>
                                            <LockOpenOutlinedIcon />
                                        </ListItemIcon>
                                        <ListItemText>
                                            <a>Reset Password</a>
                                        </ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <Dialog
                                        className="account-status-dialog"
                                        fullScreen={fullScreen}
                                        open={resetPwOpen}
                                        onClose={handleResetPwClose}
                                        aria-labelledby="responsive-dialog-title"
                                    >
                                        <DialogTitle id="responsive-dialog-title">{`Are you sure you want to reset your password?`}</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText>
                                                This action is irreversible, and the new password will send into your email. You will be logged out immediately upon this action.
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button autoFocus onClick={handleResetPwClose} color="primary">
                                                Cancel
                                            </Button>
                                            <Button onClick={handleResetPw} color="primary" autoFocus>
                                                Proceed
                                            </Button>
                                        </DialogActions>
                                    </Dialog>

                                    <ListItem button onClick={handleClickOpen}>
                                        <ListItemIcon>
                                            <BlockIcon />
                                        </ListItemIcon>
                                        <ListItemText>
                                            <a>{Cookies.get("status") == "0" ? "Deactivate Account" : "Activate Account"}</a>
                                        </ListItemText>
                                    </ListItem>
                                    <Dialog
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
                                            <Button onClick={handleAccStatus} color="primary" autoFocus>
                                                Proceed
                                            </Button>
                                        </DialogActions>
                                    </Dialog>

                                    <ListItem button onClick={editable == true ? handleClickLogoutOpen : handleLogoutAction}>
                                        <ListItemIcon>
                                            <ExitToAppOutlinedIcon />
                                        </ListItemIcon>
                                        <ListItemText>
                                            <a>Logout</a>
                                        </ListItemText>
                                    </ListItem>
                                    <Dialog
                                        className="account-logout-dialog"
                                        fullScreen={fullScreen}
                                        open={logoutOpen}
                                        onClose={handleLogoutClose}
                                        aria-labelledby="responsive-dialog-title"
                                    >
                                        <DialogTitle id="responsive-dialog-title">{`Are you sure you want to log out?`}</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText>
                                                Any changes you have made will be permanently lost.
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button autoFocus onClick={handleLogoutClose} color="primary">
                                                Cancel
                                            </Button>
                                            <Button onClick={handleLogoutAction} color="primary" autoFocus>
                                                Logout
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </List>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={12} md={8} lg={9}>
                        <Card className="profile-content">
                            <CardContent className={classes.cardHeader}>
                                <p className={classes.cardHeaderTitle}>Profile Information</p>
                                <Typography
                                    color="textSecondary"
                                    variant="body1"
                                >Role: { (Cookies.get("role") == "0") ? "Admin" : (Cookies.get("role") == "1") ? "Customer" : "Staff" }
                                </Typography>
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
                            <Divider />
                            <form>
                                <CardContent>
                                    {editable && <div>
                                        <Typography
                                                color="textSecondary"
                                                variant="body1"
                                                stlye={{marginBottom: "3.5px!important"}}
                                        >* You can straightaway edit the information by just focusing on the input form.
                                        </Typography>
                                        <Typography
                                                color="textSecondary"
                                                variant="body1"
                                                stlye={{marginBottom: "3.5px!important"}}
                                        >* You may ignore the form if you don't wish to change the profile information.
                                        </Typography>
                                        <Typography
                                                color="textSecondary"
                                                variant="body1"
                                                stlye={{marginBottom: "3.5px!important"}}
                                        >* Any attempt to update the password required the verification on the current password.
                                        </Typography>
                                        <Typography
                                                color="textSecondary"
                                                variant="body1"
                                                stlye={{marginBottom: "3.5px!important"}}
                                        >* Profile image can be edited by clicking on the profile image picture.
                                        </Typography>
                                        <Typography
                                                color="textSecondary"
                                                variant="body1"
                                                stlye={{marginBottom: "3.5px!important"}}
                                        >* Updated data will be only update visually when page re-render.
                                        </Typography>
                                    </div>}
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={12} md={12} lg={6}>
                                            <TextField 
                                                name="username"
                                                id="standard-required"
                                                className="MuiInputs"
                                                label="Username"
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                fullWidth
                                                disabled
                                                {...editable == true ? {helperText: "* Username is not editable"} : ""}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={6}>
                                            <TextField 
                                                name="email"
                                                {...editable == true ? {enabled: "enabled"} : {disabled: "disabled"}}
                                                {...(errors.email && {error: true, helperText: errors.email})}
                                                id="standard-email-required"
                                                className="MuiInputs"
                                                label="Email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                fullWidth
                                                disabled
                                                {...editable == true ? {helperText: "* Email is not editable"} : ""}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={6}>
                                            <TextField 
                                                name="first_name"
                                                {...editable == true ? {enabled: "enabled"} : {disabled: "disabled"}}
                                                id="standard-required"
                                                className="MuiInputs"
                                                label="First Name"
                                                type="text"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                onBlur={(e) => {
                                                    e.target.value ? handleUpdateProfile(e.target.name, e.target.value) : enqueueSnackbar("First name is empty, please try again", {variant: 'error'});
                                                }}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={6}>
                                            <TextField
                                                name="last_name"
                                                {...editable == true ? {enabled: "enabled"} : {disabled: "disabled"}}
                                                id="standard-input"
                                                className="MuiInputs"
                                                label="Last Name"
                                                type="text"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                onBlur={(e) => {
                                                    e.target.value ? handleUpdateProfile(e.target.name, e.target.value) : enqueueSnackbar("Last name is empty, please try again", {variant: 'error'});
                                                }}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={6}>
                                            <TextField
                                                name="password"
                                                {...editable == true ? {enabled: "enabled"} : {disabled: "disabled"}}
                                                id="standard-password-input"
                                                className="MuiInputs"
                                                label="Current Password"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={6}>
                                            <TextField
                                                name="new_password"
                                                {...editable == true ? password != "" ? md5(password) != Cookies.get("password") ? {disabled: "disabled"} : {enabled: "enabled"} : {disabled: "disabled"} : {disabled: "disabled"}}
                                                {...(errors.newPassword && {error: true, helperText: errors.newPassword})}
                                                id="standard-password-input-2"
                                                className="MuiInputs"
                                                label="New Password"
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                onBlur={(e) => {
                                                    e.target.value ? (/^\S+$/).test(e.target.value) ? handleUpdateProfile(e.target.name, e.target.value) : enqueueSnackbar("No whitespace allowed in the password", {variant: 'error'}) : enqueueSnackbar("New password field is empty, please try again", {variant: 'error'});
                                                }}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={6}>
                                            <TextField
                                                name="phone_number"
                                                {...editable == true ? {enabled: "enabled"} : {disabled: "disabled"}}
                                                {...(errors.phoneNo && {error: true, helperText: errors.phoneNo})}
                                                id="standard-input"
                                                className="MuiInputs"
                                                label="Phone No."
                                                type="tel"
                                                value={phoneNo}
                                                inputProps={{ maxLength: 12 }}
                                                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                                onChange={(e) => setPhoneNo(e.target.value)}
                                                onBlur={(e) => { 
                                                if ((/^[0-9]+$/).test(phoneNo)) {
                                                    handleUpdateProfile(e.target.name, e.target.value);
                                                } else {
                                                    enqueueSnackbar("Phone number can be only in digits value only", {variant: 'error'});
                                                }}}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={6}>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <KeyboardDatePicker
                                                    name="dob"
                                                    {...editable == true ? {enabled: "enabled"} : {disabled: "disabled"}}
                                                    className="register-dob MuiInputs"
                                                    variant="inline"
                                                    format="yyyy-MM-dd"
                                                    margin="normal"
                                                    id="date-picker-dialog"
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
                                            <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                                            <Select
                                                name="gender"
                                                {...editable == true ? {enabled: "enabled"} : {disabled: "disabled"}}
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                className="MuiInputs"
                                                fullWidth
                                                value={gender}
                                                onChange={(e) => {
                                                    setGender(e.target.value);
                                                    handleUpdateProfile(e.target.name, e.target.value);
                                                }}
                                            >
                                                <MenuItem value={0}>Male</MenuItem>
                                                <MenuItem value={1}>Female</MenuItem>
                                                <MenuItem value={2}>Others</MenuItem>
                                            </Select>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                                {/* { editable == true && 
                                <div>
                                    <Divider />
                                    <CardContent className={classes.saveEditBtn}>
                                        <input type="submit" value="Save" />
                                    </CardContent>
                                </div>
                                } */}
                            </form>
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
 
export default ProfileContent;