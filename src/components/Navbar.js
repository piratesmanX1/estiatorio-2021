// importing JQuery
import $ from 'jquery';

import { useState, useEffect, useRef } from "react";
import { Link, useHistory } from 'react-router-dom';
import Cookies from 'js-cookie'
import { destroyCookies } from '../functions/destroyCookies'

// Material UI
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

const Navbar = ({setLogin, login}) => {
    const useStyles = makeStyles((theme) => ({
      root: {
        display: 'flex',
      },
      paper: {
        marginRight: theme.spacing(2),
      },
    }));
  
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    
    const [userLogin, setUserLogin] = useState(login);
    
    useEffect(() => {
      setUserLogin(login);
    });

    // Defining snackbar from MaterialUI
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();

    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };
  
    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }
  
      setOpen(false);
    };

    const logOut = () => { 
      enqueueSnackbar("Logged out", {variant: 'success'});
      destroyCookies();
      setLogin(login => login + 1);
      history.push("/login");
    };
  
    function handleListKeyDown(event) {
      if (event.key == 'Tab') {
        event.preventDefault();
        setOpen(false);
      }
    }
  
    // return focus to the button when we transitioned from !open -> open
    // const prevOpen = useRef(open);
    // useEffect(() => {
    //   if (prevOpen.current == true && open == false) {
    //     anchorRef.current.focus();
    //   }
  
    //   prevOpen.current = open;
    // }, [open]);


  // due to lifecycle concerns, we will put jQuery codes in useEffect, where the jQuery codes will be executed after render
  useEffect(() => {
    // Adding the class into the navbar when onscroll
    window.onscroll = () => {
      if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        $("#estiatorio-header").addClass("elementor-sticky--active elementor-section--handles-inside elementor-sticky--effects");
      } else {
        $("#estiatorio-header").removeClass("elementor-sticky--active elementor-section--handles-inside elementor-sticky--effects");
      }
    };

    // when onclick on the mobile navbar button
    $("#menu-mobile-nav").click(function(){
      // adding class into HTML tag
      $("HTML").addClass("mobile-nav-active");
    });
    $(".menu-mobile-nav-button").click(function(){
      // adding class into HTML tag
      $("HTML").addClass("mobile-nav-active");
    });
  
    // when onclick on the close navbar button
    $(".mobile-navbar .mobile-nav-close").click(function(){
      // adding class into HTML tag
      $("HTML").removeClass("mobile-nav-active");
    });
    

    // when onclick outside of the mobile navbar section, auto close it via event.composedPath()
    const target = document.querySelector('.rominal-overlay');
    
    document.addEventListener('click', (event) => {
      const withinBoundaries = event.composedPath().includes(target)

      if (withinBoundaries && ($("HTML").hasClass("mobile-nav-active"))) {
        // clicks were made outside the mobile-navbar
        $("HTML").removeClass("mobile-nav-active");
      } else {
        // clicks were made within the mobile-navbar
      } 
    })
  });

  return (
    <div id="navbar" data-elementor-type="header" data-elementor-id={3655} className="elementor elementor-3655 elementor-location-header estiatorio-nav" data-elementor-settings="[]">
        <div className="elementor-section-wrap">
          <section className="elementor-section elementor-top-section elementor-element elementor-element-4154c26 elementor-section-full_width header-absolute elementor-section-height-default elementor-section-height-default" data-id="4154c26" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
            <div className="elementor-container elementor-column-gap-no">
              <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-6e44790" data-id="6e44790" data-element_type="column">
                <div className="elementor-widget-wrap elementor-element-populated">
                  <section className="elementor-section elementor-inner-section elementor-element elementor-element-3f91df7 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="3f91df7" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
                    <div className="elementor-container elementor-column-gap-no">
                      <div className="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-422ceb2" data-id="422ceb2" data-element_type="column">
                        <div className="elementor-widget-wrap elementor-element-populated">
                          <div className="elementor-element elementor-element-3a383ce elementor-widget__width-initial elementor-widget-mobile__width-inherit elementor-widget elementor-widget-text-editor" data-id="3a383ce" data-element_type="widget" data-widget_type="text-editor.default">
                            <div className="elementor-widget-container"> Reservation number:<a style={{color: 'var(--primary)'}} href="tel:60104583800">+60 104583800</a></div>
                          </div>
                          <div className="elementor-element elementor-element-3004285 elementor-widget__width-initial elementor-hidden-phone elementor-widget elementor-widget-text-editor" data-id={3004285} data-element_type="widget" data-widget_type="text-editor.default">
                            <div className="elementor-widget-container"> 62502 Putrajaya. Perdana Putra, Administrative Centre</div>
                          </div>
                          <div className="elementor-element elementor-element-c119ac9 elementor-icon-list--layout-inline elementor-widget__width-initial elementor-align-right elementor-mobile-align-center elementor-widget-mobile__width-inherit elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="c119ac9" data-element_type="widget" data-widget_type="icon-list.default">
                            <div className="elementor-widget-container">
                              <ul className="elementor-icon-list-items elementor-inline-items">
                                <li className="elementor-icon-list-item elementor-inline-item">
                                  <a href="#"> <span className="elementor-icon-list-icon"> <i aria-hidden="true" className="fab fa-facebook-f" /> </span> <span className="elementor-icon-list-text" /> </a>
                                </li>
                                <li className="elementor-icon-list-item elementor-inline-item">
                                  <a href="#"> <span className="elementor-icon-list-icon"> <i aria-hidden="true" className="fab fa-twitter" /> </span> <span className="elementor-icon-list-text" /> </a>
                                </li>
                                <li className="elementor-icon-list-item elementor-inline-item">
                                  <a href="#"> <span className="elementor-icon-list-icon"> <i aria-hidden="true" className="fab fa-linkedin-in" /> </span> <span className="elementor-icon-list-text" /> </a>
                                </li>
                                <li className="elementor-icon-list-item elementor-inline-item">
                                  <a href="#"> <span className="elementor-icon-list-icon"> <i aria-hidden="true" className="fab fa-youtube" /> </span> <span className="elementor-icon-list-text" /> </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                  <header id="estiatorio-header" className="elementor-section elementor-inner-section elementor-element elementor-element-2d89802 elementor-section-height-min-height sticky-header elementor-section-boxed elementor-section-height-default" data-id="2d89802" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;sticky&quot;:&quot;top&quot;,&quot;sticky_on&quot;:[&quot;desktop&quot;],&quot;sticky_effects_offset&quot;:50,&quot;sticky_offset&quot;:0}">
                    <div className="elementor-container elementor-column-gap-no">
                      <div className="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-00f1991" data-id="00f1991" data-element_type="column">
                        <div className="elementor-widget-wrap elementor-element-populated">
                          <div className="elementor-element elementor-element-734d50c elementor-widget-tablet__width-initial elementor-hidden-desktop elementor-hidden-phone elementor-widget elementor-widget-rominal-vertical-menu" data-id="734d50c" data-element_type="widget" data-widget_type="rominal-vertical-menu.default">
                            <div className="elementor-widget-container">
                              <div className="elementor-canvas-menu-wrapper">
                                <a className="menu-mobile-nav-button"> <span className="toggle-text screen-reader-text">Menu</span> <i className="rominal-icon-bars" /> </a>
                              </div>
                            </div>
                          </div>
                          <div className="elementor-element elementor-element-542e22a elementor-widget__width-auto logo elementor-widget elementor-widget-image" data-id="542e22a" data-element_type="widget" data-widget_type="image.default">
                            <div className="elementor-widget-container">
                              <Link to="/"> 
                                <img width={140} height={32} src="../assets/image/L00.png" className="lazyload attachment-full size-full" alt="Estiatorio" />
                              </Link>
                            </div>
                          </div>
                          <div className="elementor-element elementor-element-cfbafc6 elementor-widget__width-auto elementor-hidden-tablet elementor-hidden-phone elementor-widget elementor-widget-rominal-nav-menu" data-id="cfbafc6" data-element_type="widget" data-widget_type="rominal-nav-menu.default">
                            <div className="elementor-widget-container">
                              <div className="elementor-nav-menu-wrapper">
                                <nav className="main-navigation">
                                  <div className="primary-navigation">
                                    <ul id="menu-1-cfbafc6" className="menu">
                                      <li id="menu-item-5239" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-5239"><Link to="/"><span>Home</span></Link></li>
                                      {((Cookies.get("role") !== "1") && (Cookies.get("user_id"))) && <li id="menu-item-5239" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-5239"><Link to="/dashboard"><span>Dashboard</span></Link></li> }
                                      {/* <li id="menu-item-7622" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-7622"><Link to="/dashboard"><span>Dashboard</span></Link>
                                        <ul className="sub-menu">
                                          <li id="menu-item-7788" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-7788"><Link to=""><span>TBA</span></Link></li>
                                        </ul>
                                      </li> */}
                                      <li id="menu-item-7621" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-7621"><Link to="/browse"><span>Restaurant</span></Link></li>
                                      {/* <li id="menu-item-856" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-856"><Link to="/profile"><span>Profile</span></Link>
                                        <ul className="sub-menu">
                                          <li id="menu-item-7597" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-7597"><Link to="/log"><span>Reservation Log</span></Link></li>
                                          <li id="menu-item-7596" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-7596"><Link to="/reset-password"><span>Reset Password</span></Link></li>
                                          <li id="menu-item-7598" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-7598"><Link to="/logout"><span>Logout</span></Link></li>
                                        </ul>
                                      </li> */}
                                      <li id="menu-item-5201" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-5201"><a href="/#contact"><span>Contact</span></a></li>
                                    </ul>
                                  </div>
                                </nav>
                              </div>
                            </div>
                          </div>
                          
                          <div className="elementor-element elementor-element-03dba10 elementor-align-right elementor-widget__width-auto elementor-widget-tablet__width-initial elementor-widget-mobile__width-auto elementor-hidden-phone elementor-widget elementor-widget-button" data-id="03dba10" data-element_type="widget" data-widget_type="button.default">
                            <div className="elementor-widget-container">
                              <div className="elementor-button-wrapper">
                              {Cookies.get("user_id") &&
                              <div className="nav-profile-container">
                                <img className="nav-profile-img" src={Cookies.get("profile_image") != null ? Cookies.get("profile_image") : "./assets/image/P00.png"} />
                                <Button
                                  className="nav-menu-toggler"
                                  ref={anchorRef}
                                  aria-controls={open ? 'menu-list-grow' : undefined}
                                  aria-haspopup="true"
                                  onClick={handleToggle}
                                >
                                  {Cookies.get("first_name") + " " + Cookies.get("last_name")}<ArrowDropDownIcon />
                                </Button>
                                <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                                  {({ TransitionProps, placement }) => (
                                    <Grow
                                      {...TransitionProps}
                                      style={{ transformOrigin: placement == 'bottom' ? 'center top' : 'center bottom' }}
                                    >
                                      <Paper>
                                        <ClickAwayListener onClickAway={handleClose}>
                                          <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                            <MenuItem onClick={handleClose}><Link id="profile-link-id" to="/profile">Profile Page</Link></MenuItem>
                                            {((Cookies.get("role") == "1") && (Cookies.get("user_id"))) && <MenuItem onClick={handleClose}><Link id="reservation-log-id" to={`/log/${Cookies.get("user_id")}`}>Reservation Log</Link></MenuItem> }
                                            <MenuItem onClick={logOut}><a>Logout</a></MenuItem>
                                          </MenuList>
                                        </ClickAwayListener>
                                      </Paper>
                                    </Grow>
                                  )}
                                </Popper>
                              </div>
                                // <Link to="/login" className="elementor-button-link elementor-button elementor-size-sm">
                                //   <span className="elementor-button-content-wrapper">
                                //     <span className="elementor-button-text">test</span>
                                //   </span>
                                // </Link>
                              }
                              {!Cookies.get("user_id") &&
                                <Link to="/login" className="elementor-button-link elementor-button elementor-size-sm"> <span className="elementor-button-content-wrapper"> <span className="elementor-button-text">sign in</span> </span>
                                </Link>
                              }
                              </div>
                            </div>
                          </div>
                          <div className="elementor-element elementor-element-f90b772 elementor-widget-tablet__width-initial elementor-hidden-desktop elementor-widget-mobile__width-auto elementor-hidden-tablet elementor-widget elementor-widget-rominal-vertical-menu" data-id="f90b772" data-element_type="widget" data-widget_type="rominal-vertical-menu.default">
                            <div className="elementor-widget-container">
                              <div className="elementor-canvas-menu-wrapper">
                                <a id="menu-mobile-nav" className="menu-mobile-nav-button"> <span className="toggle-text screen-reader-text">Menu</span> <i className="rominal-icon-bars" /> </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </header>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
  );
}

export default Navbar;