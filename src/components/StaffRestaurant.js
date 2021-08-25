import axios from 'axios';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';

import { makeStyles } from '@material-ui/core/styles';
import { useState, useEffect } from "react";

import Cookies from 'js-cookie'

// Functions
import { pageValidation } from '../functions/pageValidation'
import { formatTime } from '../functions/formatTime'
import { formatDate } from '../functions/formatDate'
import { validateJSON } from '../functions/validateJSON'

// components
import StaffRestaurantForm from './StaffRestaurantForm';
import StaffRestaurantContext from './StaffRestaurantContext';

export default function StaffRestaurant() {
  // Defining snackbar from MaterialUI
  const { enqueueSnackbar } = useSnackbar();

  // setState to determine whether the staff is having a restaurant under the user or not
  const [restaurantData, setRestaurantData] = useState();
  
  const fetchDataRestaurant = () => {
      const API_PATH = `http://localhost:80/APU/FYP/estiatorio/src/api/fetch_restaurant.php`; // direct it to the PHP folder
      
      let formData = new FormData();
      formData.append("user_id", Cookies.get("user_id"));

      axios.post(API_PATH, formData) // asynchronous, therefore promises
          .then((res) => {
              // if POST is a success then output a snackbar from MaterialUI
              if (res.data == false) {
                  // if user data not found
                  enqueueSnackbar('Data unable to be fetched, please try again.', {variant: 'error'});
              } else if (validateJSON(res.data) == true) {
                  // if data is in JSON format, means the user data retrieved
                  // proceed to extract the data and set it into React Session
                  let datarows;
                  res.data.map((data) => {
                    datarows = {
                      restaurant_id: data.restaurant_id, restaurant_logo: data.restaurant_logo, restaurant_name: data.restaurant_name,
                      restaurant_description: data.restaurant_description, restaurant_address: data.restaurant_address, seat_capacity: data.seat_capacity, 
                      reservation_fee: data.reservation_fee,
                      status: data.status, region_id: data.region_id
                    }
                  });
                  setRestaurantData(datarows);
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
      fetchDataRestaurant();
  }, [])


  return (
    <motion.div 
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{duration: 0.75}}
    >
    <div className="StaffRestaurant">
      {restaurantData && <StaffRestaurantContext restaurantData={restaurantData} fetchRestaurant={fetchDataRestaurant} />}
      {!restaurantData && 
        <StaffRestaurantForm fetchRestaurant={fetchDataRestaurant}/>
      }
    </div>
    </motion.div>
  );
}
