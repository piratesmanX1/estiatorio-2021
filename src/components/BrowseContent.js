import axios from 'axios';
import { Link, useHistory, useParams } from "react-router-dom";
import { motion } from 'framer-motion';
import LoadingBar from "react-top-loading-bar";
import { useState, useEffect, useRef } from "react";
import { useSnackbar } from 'notistack';

import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';

import { destroyCookies } from '../functions/destroyCookies'
import Cookies from 'js-cookie'

// Functions
import { validateJSON } from '../functions/validateJSON'

// MaterialUI
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import RestaurantList from './RestaurantList';
import { data } from 'jquery';

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        marginTop: theme.spacing(2),
      },
    },
  }));

const BrowseContent = () => {
    const classes = useStyles();

    const { keywords } = useParams();
    const { region } = useParams();

    // Defining snackbar from MaterialUI
    const { enqueueSnackbar } = useSnackbar();

    const [region_list, setRegion_list] = useState([]);
    const [restaurant_list, setRestaurant_list] = useState([]);

    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault(); // preventing the form onsubmit automatically refresh the page
        history.push(`/browse/${restaurantName}/${regionInput}/`)
        restaurantList();
    }

    const[regionInput, setRegionInput] = useState(region ? region : 0);
    const[restaurantName, setRestaurantName] = useState(keywords ? keywords : "");
    const[totalResult, setTotalResult] = useState(0);

    const fetchData = () => {
        const API_PATH = `http://localhost:80/APU/FYP/estiatorio/src/api/fetch_region.php`; // direct it to the PHP folder
        
        axios.post(API_PATH) // asynchronous, therefore promises
            .then((res) => {
                // if POST is a success then output a snackbar from MaterialUI
                if (res.data == false) {
                    // if user data not found
                    enqueueSnackbar('Data unable to be fetched, please try again.', {variant: 'error'});
                } else if (validateJSON(res.data) == true) {
                    // if data is in JSON format, means the user data retrieved
                    // proceed to extract the data and set it into React Session
                    let datarows = [];
                    res.data.map((data) => {
                        datarows.push({region_id: data.region_id, region_name: data.region_name});
                    });  
                    
                    setRegion_list(datarows);
                } else {
                    // in this case res.data must be returning an error message
                    enqueueSnackbar(res.data, {variant: 'error'});
                }
            })
            .catch((err) =>  {
                enqueueSnackbar(err, {variant: 'error'});
                throw Error("Error: Data fetching process failed for some reason. Error: " + err); // making a custom error message that will show in console
            });
    }

    const [ pageTotal, setPageTotal ] = useState(1);

    
    const fetchPageNumber = () => {
        let formData = new FormData();

        formData.append("keywords", restaurantName);
        formData.append("region", regionInput);

        const API_PATH = `http://localhost:80/APU/FYP/estiatorio/src/api/restaurant_total_page.php`; // direct it to the PHP folder

        axios.post(API_PATH, formData) // asynchronous, therefore promises
            .then((res) => {
                // if POST is a success then output a snackbar from MaterialUI
                if (res.data == false) {
                    setPageTotal(0);
                    enqueueSnackbar("Total page number not found", {variant: 'error'});
                    console.log("Not found");
                } else if (validateJSON(res.data) == true) {
                    // if data is in JSON format, means the user data retrieved
                    // proceed to extract the data and set it into React Session
                    res.data.map((data) => {
                        setPageTotal(Math.ceil(data.total_page / 5));
                    });  
                    console.log(pageTotal + " page");
                } else {
                    setRestaurant_list(null);
                    setTotalResult(0);
                    // in this case res.data must be returning an error message
                    enqueueSnackbar(res.data, {variant: 'error'});
                }
            })
            .catch((err) =>  {
                setRestaurant_list(null);
                setTotalResult(0);
                enqueueSnackbar(err, {variant: 'error'});
                throw Error("Error: Data fetching process failed for some reason. Error: " + err); // making a custom error message that will show in console
            });
    }

    const restaurantList = (page) => {
        let formData = new FormData();

        formData.append("keywords", restaurantName);
        formData.append("region", regionInput);
        formData.append("limit", page);

        console.log(restaurantName);
        console.log(regionInput);

        const API_PATH = `http://localhost:80/APU/FYP/estiatorio/src/api/restaurant_list.php`; // direct it to the PHP folder

        axios.post(API_PATH, formData) // asynchronous, therefore promises
            .then((res) => {
                // if POST is a success then output a snackbar from MaterialUI
                if (res.data == false) {
                    // if user data not found
                    setRestaurant_list(null);
                    setTotalResult(0);
                    enqueueSnackbar("Data not found", {variant: 'error'});
                    console.log("Not found");
                } else if (validateJSON(res.data) == true) {
                    // if data is in JSON format, means the user data retrieved
                    // proceed to extract the data and set it into React Session
                    let datarows = [];
                    let totalresult;
                    res.data.map((data) => {
                        datarows.push({restaurant_id: data.restaurant_id, restaurant_name: data.restaurant_name, 
                            restaurant_logo: data.restaurant_logo, restaurant_description: data.restaurant_description, 
                            restaurant_address: data.restaurant_address, 
                            reservation_fee: data.reservation_fee, seat_capacity: data.seat_capacity, region_id: data.region_id, status: data.status});
                    });  
                    console.log(datarows);
                    setRestaurant_list(datarows);
                    setTotalResult(Object.keys(datarows).length);
                    enqueueSnackbar("Total number of " + Object.keys(datarows).length + " result found", {variant: 'success'});
                } else {
                    setRestaurant_list(null);
                    setTotalResult(0);
                    // in this case res.data must be returning an error message
                    enqueueSnackbar(res.data, {variant: 'error'});
                }
            })
            .catch((err) =>  {
                setRestaurant_list(null);
                setTotalResult(0);
                enqueueSnackbar(err, {variant: 'error'});
                throw Error("Error: Data fetching process failed for some reason. Error: " + err); // making a custom error message that will show in console
            });
    }

    const [progressBar, setProgressBar] = useState(0);

    useEffect(() => {
        setProgressBar(100);

        document.getElementById("estiatorio-header").classList.add("inverted");
        document.getElementById("navbar").classList.remove("hidden");
        document.getElementById("contact").classList.remove("hidden");
        document.getElementById("navbar").classList.remove("removed");
        document.getElementById("contact").classList.remove("removed");
        document.title = ' Browse | Estiatorio ';

        // fetch the data onload
        fetchData();
        fetchPageNumber();
        restaurantList();
    }, [])

    const [page, setPage] = useState(1);
    const handleChange = (event, value) => {
        // pagination trigger the data refresh
        setPage(value);
        restaurantList(value - 1);
    };

    return (
        <div className="browse-list" style={{marginTop:"180px", marginBottom: "60px", padding: "0 50px"}}>
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
                <section className="elementor-section elementor-top-section elementor-element elementor-element-11bc46e elementor-section-stretched elementor-section-content-middle elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="11bc46e" data-element_type="section" data-settings="{&quot;stretch_section&quot;:&quot;section-stretched&quot;}" style={{width: '1090px', left: '-0.1px'}}>
                    <div className="elementor-container elementor-column-gap-no">
                    <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-42fe898" data-id="42fe898" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
                        <div className="elementor-widget-wrap elementor-element-populated">
                        <div className="elementor-element elementor-element-94ed033 layout-style-1 elementor-widget elementor-widget-babe-search-form" data-id="94ed033" data-element_type="widget" data-widget_type="babe-search-form.default">
                            <div className="elementor-widget-container">
                            <div id="rominal-search-box" className="babe-search-box">
                                <form onSubmit={handleSubmit} name="search_form" method="POST" id="search_form" className="babe-search-form">
                                <div className="search-form-inner">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={3} md={3} lg={3}>
                                    <InputLabel id="demo-simple-select-label">Region *</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        name="restaurant_region"
                                        value={regionInput}
                                        fullWidth
                                        onChange={(e) => setRegionInput(e.target.value)}
                                        required
                                    > 
                                    <MenuItem value={0}>ALL</MenuItem>
                                    {
                                        region_list.map((data) => (
                                            <MenuItem value={data.region_id}>{data.region_name}</MenuItem>
                                        )) 
                                    }
                                    </Select>
                                    </Grid>
                                    <Grid item xs={12} sm={5} md={6} lg={6}>
                                    <Tooltip title="Restaurant Name" placement="bottom" arrow>
                                        <TextField                                     
                                            id="standard-required"
                                            name="restaurant_name"
                                            label="Restaurant Name"
                                            fullWidth
                                            value={restaurantName}
                                            onChange={(e) => setRestaurantName(e.target.value)}
                                        />
                                    </Tooltip>
                                    </Grid>
                                    <Grid item xs={12} sm={4} md={3} lg={3}>
                                    <div className="submit">
                                        <button 
                                            name="submit" 
                                            className="btn button btn-primary btn-search" 
                                            value={1}
                                        > Browse </button>
                                    </div>
                                    </Grid>
                                </Grid>
                                </div>
                                </form>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </section>
                <div>
                    <p style={{fontSize: "20px"}}>Total {totalResult} items found: </p>
                </div>
                <div className="browse-context">
                    {(restaurant_list != null) && 
                        <RestaurantList restaurant_list={restaurant_list} setProgressBar={setProgressBar} progressBar={progressBar}/>}
                    {(restaurant_list == null)  && <p style={{height: "100vh", color: "red", fontSize: "18px", paddingLeft: "30px"}}>No result</p>}
                </div>
                <div className={`pagination-container ` + classes.root}>
                    <Pagination count={pageTotal} page={page} onChange={handleChange} />
                </div>
            </motion.div>
        </div>
    );
}
 
export default BrowseContent;