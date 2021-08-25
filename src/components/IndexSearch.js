import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { destroyCookies } from '../functions/destroyCookies'
import Cookies from 'js-cookie'

// Functions
import { validateJSON } from '../functions/validateJSON'

import { useState, useEffect, useRef, useLayoutEffect } from "react";

// MaterialUI
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';

const IndexSearch = () => {
    // Defining snackbar from MaterialUI
    const { enqueueSnackbar } = useSnackbar();

    const [region_list, setRegion_list] = useState([]);

    const history = useHistory();

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

    useEffect(() => {
        // fetch the data onload
        fetchData();
    }, [])


    // checking the first initial render
    const firstRender = useRef(false);

    // // creating error message object literals for form validation
    // const validation = () => {
    //     let validate = {}
    //     // validate.region = region ? "" : "* This field is required"
    //     validate.restaurantName = restaurantName !== "" || null || " " ? "" : "* This field is required"
        
    //     setErrors ({
    //         // Saving errors into the state object via seperator operator
    //         ...validate
    //     })

    //     // return the object of values, by using every() to validate the array with the provided function
    //     // if each of the values from the input delivered in validate object is valid according to the condition set within every(), then return boolean.
    //     return Object.values(validate).every(x => x == "") // if the object value is not empty then it will return true
    // }

    const handleSubmit = (e) => {
        e.preventDefault(); // preventing the form onsubmit automatically refresh the page
        history.push(`/browse/${restaurantName}/${region}`);
    }

    const[region, setRegion] = useState(0);
    const[restaurantName, setRestaurantName] = useState("");
    // const[errors, setErrors] = useState({});

    // useEffect(() => {
    //     // Perform input validation after setState(), by using custom hook and useRef
    //     if (firstRender.current) {
    //         validation();
    //     } else {
    //         firstRender.current = true;
    //     }

    // }, [restaurantName])

    return (
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
                                value={region}
                                fullWidth
                                onChange={(e) => setRegion(e.target.value)}
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
    );
}
 
export default IndexSearch;