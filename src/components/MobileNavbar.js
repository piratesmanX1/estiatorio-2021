// importing JQuery
import $ from 'jquery';
import { useState, useEffect } from "react";
import { Link, useHistory } from 'react-router-dom';
import Cookies from 'js-cookie'

import { useSnackbar } from 'notistack';

// Functions
import { destroyCookies } from '../functions/destroyCookies'

const MobileNavbar = ({setLogin, login}) => {
    // Defining snackbar from MaterialUI
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();

    const [userLogin, setUserLogin] = useState(login);
    
    useEffect(() => {
        setUserLogin(login);
    });

    const logOut = () => { 
        enqueueSnackbar("Logged out", {variant: 'success'});
        destroyCookies();
        $("HTML").removeClass("mobile-nav-active");
        setLogin(login => login + 1);
        history.push("/login");
    };
    return (
        <div className="mobile-navbar">
            <div className="rominal-mobile-nav inactive"> <a className="mobile-nav-close"><i className="rominal-icon-times" /></a>
                <nav className="mobile-navigation">
                <div className="handheld-navigation">
                    {Cookies.get("user_id") &&
                        <div className="mobile-nav-profile">
                            <div style={{display: "inline-block"}}>
                                <img src={Cookies.get("profile_image")} style={{height: "45px", width: "45px", borderRadius: "50%", marginRight: "20px"}}/>
                            </div>
                            <div style={{display: "inline-flex", justifyContent: "center", transform: "translateY(-31.5px)", flexDirection: "column"} }>
                                <p style={{margin: "unset", textTransform: "uppercase", color: "#FFF", whiteSpace: "nowrap", width: "122px", overflow: "hidden", textOverflow: "ellipsis"}}>{Cookies.get("first_name") + " " + Cookies.get("last_name")}</p>
                                <div style={{color: "rgba(100, 100, 100, 1)"}}>Role: { (Cookies.get("role") == "0") ? "Admin" : (Cookies.get("role") == "1") ? "Customer" : "Staff" }</div>
                            </div>
                        </div>
                    }
                    <ul id="menu-main-menu-1" className="menu">
                        <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-7620"><Link to="/"><span>Home</span></Link></li>
                        {(Cookies.get("user_id") && Cookies.get("role") != 1) && <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-home current-menu-ancestor current-menu-parent current_page_parent current_page_ancestor menu-item-has-children menu-item-843"><Link to="/dashboard"><span>Dashboard</span></Link></li>}
                        <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-7621"><a href="#contact"><span>Contact</span></a></li>
                        <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-5239"><Link to="/browse"><span>Browse</span></Link></li>
                        {Cookies.get("user_id") && <li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-856"><Link to="/profile"><span>Profile Page</span></Link></li>}
                        {!Cookies.get("user_id") && <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-7596"><Link to="/reset-password"><span>Reset Password</span></Link></li> }
                        {Cookies.get("user_id") && <li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-7598"><a onClick={logOut}><span>Logout</span></a></li>}
                    </ul>
                </div>
                </nav>
            </div>
            <div className="rominal-overlay"></div>
        </div>
    );
}
 
export default MobileNavbar;