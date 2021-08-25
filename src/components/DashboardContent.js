import { useState, useEffect } from "react";
import { Link, useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoadingBar from "react-top-loading-bar";
import { useSnackbar } from 'notistack';

import Cookies from 'js-cookie'
import { destroyCookies } from '../functions/destroyCookies'

// Functions
import { pageValidation } from '../functions/pageValidation'
import { formatTime } from '../functions/formatTime'
import { formatDate } from '../functions/formatDate'
import { validateJSON } from '../functions/validateJSON'

import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import PowerSettingsNewOutlinedIcon from '@material-ui/icons/PowerSettingsNewOutlined';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import BookmarksOutlinedIcon from '@material-ui/icons/BookmarksOutlined';
import RecentActorsOutlinedIcon from '@material-ui/icons/RecentActorsOutlined';
import HomeWorkOutlinedIcon from '@material-ui/icons/HomeWorkOutlined';
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';

// Components
import DashboardContext from "./DashboardContext";
import AdminRestaurantList from "./AdminRestaurantList";
import StaffRestaurant from "./StaffRestaurant";
import AdminUserList from "./AdminUserList";
import AdminRegionList from "./AdminRegionList";
import AdminAccountLog from "./AdminAccountLog";
import StaffReservationList from "./StaffReservationList";
import StaffMonthlyReport from "./StaffMonthlyReport";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        background: "unset!important",
        padding: "12px!important",
        color: "#FFF!important",
        [theme.breakpoints.up('sm')]: {
        display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

const DashboardContent = ({setLogin, login}, props) => {
    const history = useHistory();

    // Defining snackbar from MaterialUI
    const { enqueueSnackbar } = useSnackbar();

    // defining the title of the dashboard context based on the selected tab
    const [dashboardTitle, setDashboardTitle] = useState("Dashboard");

    // setting the class of the active tab
    const tabActive = (tab) => {
        var elems = document.querySelectorAll(".MuiListItem-gutters.MuiListItem-button.active");
        [].forEach.call(elems, function(el) {
            el.classList.remove("active");
        });

        var addElems = document.querySelectorAll(".MuiListItem-gutters.MuiListItem-button." + tab);
        [].forEach.call(addElems, function(al) {
            al.classList.add("active");
        });
    }

    const { window } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // bottom navigation values
    const [value, setValue] = useState(0);

    const logOut = () => {
        destroyCookies();
        enqueueSnackbar("Logged out", {variant: 'success'});
        setLogin(login => login + 1);
        history.push('/');
    }

    // page validation for dashboard 
    let menuItems;
    let dashboardComponent;
    if (pageValidation() == true) {
        // if the user have logged in, check the user role whether it is authorized or not 
        if (Cookies.get("role") == 1) {
            // if its customer
            enqueueSnackbar("You are not authorized to access this page.", {variant: 'error'});
            history.push('/');
        } else {
            // if its authorized user: Admin or Staff, setup the dashboard menu array specifically
            if (Cookies.get("role") == 0) {
                // Admin
                menuItems = [
                    { label: "Dashboard", icon: <BookmarksOutlinedIcon />, className: "dashboard-tab" },
                    { label: "User List", icon: <RecentActorsOutlinedIcon />, className: "user-list-tab" },
                    { label: "Restaurant List", icon: <HomeWorkOutlinedIcon />, className: "restaurant-list-tab" },
                    { label: "Region List", icon: <RoomOutlinedIcon />, className: "region-list-tab" },
                    { label: "Account Log", icon: <AssessmentOutlinedIcon />, className: "monthly-report-tab" }
                ];
                // components
                // dashboardComponent = [
                //     { label: "Dashboard", component: <DashboardContext /> },
                //     { label: "User List", component: <AdminUserList /> },
                //     { label: "Restaurant List", component: <DashboardRestaurantList /> },
                //     { label: "Region List", component: <AdminRegionList /> }
                // ];
            } else {
                // Staff
                menuItems = [
                    { label: "Dashboard", icon: <BookmarksOutlinedIcon />, className: "dashboard-tab" },
                    { label: "Restaurant", icon: <HomeWorkOutlinedIcon />, className: "restaurant-list-tab" },
                    { label: "Reservation List", icon: <ListAltOutlinedIcon />, className: "reservation-list-tab" },
                    { label: "Monthly Report", icon: <LibraryBooksIcon />, className: "monthly-report-tab" }
                ];
                // components
                // dashboardComponent = [
                //     { label: "Dashboard", component: <DashboardContext /> },
                //     { label: "Restaurant List", component: <DashboardRestaurantList /> },
                //     { label: "Reservation List", component: <StaffReservationList /> },
                //     { label: "Monthly Report", component: <StaffMonthlyReport /> }
                // ];
            }
        }
    } else {
        // if user has not logged in yet
        enqueueSnackbar(pageValidation(), {variant: 'error'});
        history.push('/login');
    }

    let last_login = "-";
    if (Cookies.get("last_login")) {
        if (Cookies.get("last_login").match(null)) {
            last_login = "-";
        } else {
            last_login = formatTime(Cookies.get("last_login"));
        }
    } else {
        last_login = "-";
    }

    const drawer = (
        <div className="dashboard-sidenav-container" style={{overflow: "hidden"}}>
            <Link to="/profile" style={{textDecoration: "none"}}>
                <div className={classes.toolbar} style={{display: "flex"}}>
                    <div style={{padding: "9.5px"}}>
                        <img src={Cookies.get("profile_image") || "./assets/image/P00.png"} style={{pointerEvents: "none", height: "45px", width: "45px", borderRadius: "50%"}}/>
                    </div>
                    <div style={{transform: "translateY(13.5px)", marginLeft: "9px"}}>
                        <p style={{margin: "unset", fontWeight: "bold"}}>{Cookies.get("first_name") + " " + Cookies.get("last_name")}</p>
                        <p style={{fontSize: "12px", color: "rgb(0,0,0,0.65)"}}>{"Last login: " + last_login}</p>
                    </div>
                </div>
            </Link>
            <Divider />
            <List>
                {
                menuItems ?
                menuItems.map(({label, icon, className}) => (
                <ListItem className={className} button key={label} 
                onClick={() => {
                    setDashboardTitle(label);
                    tabActive(className);
                }}>
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText primary={label} />
                </ListItem>))
                : ""
                }
            </List>
            {/* <Divider /> */}
            <BottomNavigation
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                showLabels
                style={{
                    position: "fixed",
                    bottom: 0,
                    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                    borderTop: "1px solid rgba(0, 0, 0, 0.12)"
                }}
                className="dashboard-bottom-nav"
            >
                <Link to="/"><BottomNavigationAction label="Home" icon={<HomeOutlinedIcon />} /></Link>
                <Link to="/profile"><BottomNavigationAction label="Profile" icon={<AccountCircleOutlinedIcon />} /></Link>
                <a onClick={logOut}><BottomNavigationAction label="Logout" icon={<PowerSettingsNewOutlinedIcon />} /></a>
            </BottomNavigation>
            {/* <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                <ListItem button key={text}>
                    <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                    <ListItemText primary={text} />
                </ListItem>
                ))}
            </List> */}
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    const [progressBar, setProgressBar] = useState(0);
  
    useEffect(() => {
        setProgressBar(100);
        // hide the navbar and footer for design concerns
        document.getElementById("estiatorio-header").classList.remove("inverted");
        document.getElementById("navbar").classList.remove("hidden");
        document.getElementById("contact").classList.remove("hidden");

        document.getElementById("navbar").classList.add("removed");
        document.getElementById("contact").classList.add("removed");

        document.title = ' Dashboard | Estiatorio ';
    }, []);

return (
    <div className="DashboardContent">
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
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" style={{color: "#FFF"}} noWrap>
                        {dashboardTitle}
                    </Typography>
                    </Toolbar>
                </AppBar>
                <nav className={classes.drawer} aria-label="dashboard-menus">
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                    <Hidden smUp implementation="css">
                        <Drawer
                            container={container}
                            variant="temporary"
                            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                            open={mobileOpen}
                            onClose={handleDrawerToggle}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                        <Drawer
                            classes={{
                            paper: classes.drawerPaper,
                            }}
                            variant="permanent"
                            open
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                </nav>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <div className="dashboard-context">
                        { 
                            Cookies.get("role") == 0 ?
                                dashboardTitle === "Dashboard" 
                                ? 
                                <DashboardContext />
                                :
                                dashboardTitle === "User List"
                                ?
                                <AdminUserList />
                                :
                                dashboardTitle === "Restaurant List" 
                                ?
                                <AdminRestaurantList />
                                :
                                dashboardTitle === "Region List" 
                                ? 
                                <AdminRegionList />
                                :
                                <AdminAccountLog />
                            : Cookies.get("role") == 2 ? 
                                dashboardTitle == "Dashboard" 
                                ? 
                                <DashboardContext />
                                :
                                dashboardTitle === "Restaurant" 
                                ?
                                <StaffRestaurant />
                                :
                                dashboardTitle === "Reservation List"
                                ?
                                <StaffReservationList />
                                :
                                dashboardTitle === "Monthly Report" 
                                ? 
                                <StaffMonthlyReport />
                                :
                                setDashboardTitle("Dashboard")
                            : setDashboardTitle("Dashboard")
                        }
                    </div>
                    {/* <Typography paragraph>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                    ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum
                    facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit
                    gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id
                    donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
                    adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras.
                    Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis
                    imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget
                    arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
                    donec massa sapien faucibus et molestie ac.
                    </Typography>
                    <Typography paragraph>
                    Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla
                    facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac
                    tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet volutpat
                    consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis risus sed
                    vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in. In
                    hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem et
                    tortor. Habitant morbi tristique senectus et. Adipiscing elit duis tristique sollicitudin
                    nibh sit. Ornare aenean euismod elementum nisi quis eleifend. Commodo viverra maecenas
                    accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam ultrices sagittis orci a.
                    </Typography> */}
                </main>
            </div>
        </motion.div>
    </div>
  );
}

DashboardContent.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

export default DashboardContent;
