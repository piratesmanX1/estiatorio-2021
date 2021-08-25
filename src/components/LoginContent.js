import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoadingBar from "react-top-loading-bar";

// MaterialUI
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

// CSS
import '../assets/css/login.css';

// Components
import LoginForm from "./LoginForm";

const useStyles = makeStyles((theme) => ({
    root: {
      height: '100vh',
      backgroundImage: 'url(./assets/image/B06.jpg)',
      backgroundRepeat: 'no-repeat',
      backgroundColor:
        theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
}));

const LoginContent = ({setLogin, login}) => {
    const classes = useStyles();
    const [progressBar, setProgressBar] = useState(0);

    useEffect(() => {
        setProgressBar(100);
        // hide the navbar and footer for design concerns
        document.getElementById("estiatorio-header").classList.remove("inverted");
        document.getElementById("navbar").classList.add("hidden");
        document.getElementById("contact").classList.add("hidden");
        document.getElementById("navbar").classList.remove("removed");
        document.getElementById("contact").classList.remove("removed");
        
        document.title = ' Login | Estiatorio ';
    }, []);

    return (
        <div className="LoginContent">
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
                    <Grid className="login-banner" item xs={12} sm={4} md={7} />
                    <Grid item xs={12} sm={8} md={5} elevation={6} square>
                        <motion.div 
                            initial={{opacity: 0, x: "100vw"}}
                            animate={{opacity: 1, x: 0}}
                            exit={{opacity: 0, x: "100vw"}}
                            transition={{duration: 0.75}}
                        >
                            <LoginForm setLogin={setLogin} login={login}/>
                            <div className="register-link">
                                <Link to="/register">Register &#8594;</Link>
                            </div>
                        </motion.div>
                    </Grid>
                </Grid>
            </motion.div>
        </div>
    );
}
 
export default LoginContent;