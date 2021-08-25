import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useState, useEffect } from "react";
import { AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie'

// Importing pages as Router Links
import IndexContent from "./components/IndexContent";
import BrowseContent from "./components/BrowseContent";
import RestaurantContent from "./components/RestaurantContent";
import LoginContent from "./components/LoginContent";
import RegistrationContent from "./components/RegistrationContent";
import ProfileContent from "./components/ProfileContent";
import LogContent from "./components/LogContent";
import ResetPwContent from "./components/ResetPwContent";
import DashboardContent from "./components/DashboardContent";
import ErrorPage from "./components/ErrorPage";

import Navbar from "./components/Navbar";
import MobileNavbar from "./components/MobileNavbar";
import Footer from "./components/Footer";
import Rendering from './components/Rendering';

// Hooks
import useScript from "./hooks/useScript";
import ScrollToTop from "./hooks/scrollToTop";

function App() {
    // declaring user login status
    const [login, setLogin] = useState(0);

    // setting the state of rendering based on the lifecycle
    const [rendering, setRendering] = useState(true);
    
    // importing JavaScripts via custom hook with useEffect()
    useScript('./assets/template/rominal-template/demo2wpopal.b-cdn.net/rominal/wp-includes/js/jquery/jquery.min9d52.js?ver=3.5.1');
    useScript('./assets/template/rominal-template/demo2wpopal.b-cdn.net/rominal/wp-content/cache/min/1/11fc9b38fc584dfa7c50ce064228b4a6.js');

    useEffect(() => {
        setRendering(true);
        // if the the page has done rendered, then setRendering as false
        const loader = document.querySelector(".loader-container");
        const page = document.querySelector("#page");   

        page.className = "";
        if (loader) {
            loader.className = "loader-container";
        }

        setTimeout(() => {
            if (loader) {
                loader.classList.add("loaded");
            }
            setRendering(false);
            page.classList.add("loaded");
            setTimeout(() => {
                page.classList.remove("loaded");
            }, 5000);
        }, 2000);
    }, []);

    return(
            <Router>
                <ScrollToTop />
            {!rendering ?
                <div className="App">
                    <Navbar setLogin={setLogin} login={login}/>
                    <MobileNavbar setLogin={setLogin} login={login}/>
                    <div className="content">
                        <AnimatePresence exitBeforeEnter>
                            <Switch>
                                {/* Creating a route for each page */}
                                <Route exact path="/">
                                    <IndexContent />
                                </Route>
                                <Route path="/browse/:keywords?/:region?">
                                    <BrowseContent />
                                </Route>
                                <Route path="/restaurant/:resid">
                                    <RestaurantContent />
                                </Route>
                                <Route path="/login">
                                    <LoginContent setLogin={setLogin} login={login}/>
                                </Route>
                                <Route path="/register">
                                    <RegistrationContent />
                                </Route>
                                <Route path="/profile">
                                    <ProfileContent setLogin={setLogin} login={login}/>
                                </Route>
                                <Route path="/log">
                                    <LogContent />
                                </Route>
                                <Route path="/reset-password">
                                    <ResetPwContent />
                                </Route>
                                <Route path="/dashboard">
                                    <DashboardContent setLogin={setLogin} login={login}/>
                                </Route>
                                {/* 404 page when router link URL is towards undefined URL */}
                                {/* path="*" means catch any other route, and it must put at the bottom of <Switch> otherwise it will accept any link  */}
                                <Route path="/error/:status"
                                    component={ErrorPage}
                                />
                                <Route path="*">
                                    <ErrorPage />
                                </Route>
                            </Switch>
                        </AnimatePresence>
                    </div>
                    <Footer />
                </div>
            : 
                <Rendering />
            }
            </Router>
    );
}

export default App;