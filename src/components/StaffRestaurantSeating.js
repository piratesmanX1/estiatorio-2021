import axios from 'axios';
import { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';

import Cookies from 'js-cookie'

// function
import { removeArrayObject } from '../functions/removeArrayObject'

const StaffRestaurantSeating = ({handleComplete}) => {
    // Defining snackbar from MaterialUI
    const { enqueueSnackbar } = useSnackbar();

    // determine the length of the seating map
    const [ xCells, setXCells ] = useState(10);
    const [ yCells, setYCells ] = useState(10);
    
    const [ coordination, setCoordination ] = useState([]);

    let arrX = Array.apply(null, {length: xCells}).map(Number.call, Number);
    let arrY = Array.apply(null, {length: yCells}).map(Number.call, Number);

    const saveTable = () => {
        const API_PATH = `http://localhost:80/APU/FYP/estiatorio/src/api/add_table.php`; // direct it to the PHP folder

        // since the processing is adding a new table, we will target on the checked table rows and take it as an array
        // check if the array of object has been defined or not
        if (coordination) {
            // loop it by checking the ID and perform the deletion one by one
            // showing a loading backdrop page to prevent any interruption from user
            let iteration = 0;
            coordination.forEach(function(item) {

                let formData = new FormData();
                formData.append("positionX", item.x);
                formData.append("positionY", item.y);
                formData.append("sizeX", xCells);
                formData.append("sizeY", yCells);
                formData.append("user_id", Cookies.get("user_id"));

                axios.post(API_PATH, formData) // asynchronous, therefore promises
                .then((res) => {
                    // if POST is a success then output a snackbar from MaterialUI
                    if (res.data == true) {
                        // if data updated
                        enqueueSnackbar('Table data inserted.', {variant: 'success'});
                    } else {
                        // in this case res.data must be returning an error message
                        enqueueSnackbar(res.data, {variant: 'error'});
                    }
                })
                .catch((err) =>  {
                    enqueueSnackbar(err, {variant: 'error'});
                    throw Error("Error: Table data insertion failed for some reason. Error: " + err); // making a custom error message that will show in console
                });

                iteration = iteration + 1;

                if (iteration === coordination.length - 1) {
                    // trigger the stepper into completion
                    handleComplete();
                }
            });
        } else {
            enqueueSnackbar("Error: Table data is not defined, please re-check the table row again.", {variant: 'error'});
        }
    }

    return (
        <div className="RestaurantSeating">
            <div className="seating-map">
                {arrX.map(x => 
                    <div key={x} className="row">
                    {arrY.map(y =>
                        <input key={y} type="checkbox" id={x} name={y} onChange={(e) => {
                            if (e.target.checked) {
                                let newCoordination = coordination;
                                let newData = {x: e.target.getAttribute("id"), y: e.target.getAttribute("name")};
                                newCoordination.push(newData);
                                setCoordination(newCoordination);
                            } else {
                                // remove the value from the object array based on the given id
                                let newCoordination = removeArrayObject(coordination, "x", e.target.getAttribute("id"))
                                setCoordination(newCoordination);
                            }
                        }}/>
                    )}
                    </div>
                )}
            </div>
            <div style={{marginTop: "30px"}}>
                <label style={{margin: "0px 10px"}}>X:</label>
                <input type="number" min="10" max="20" value={xCells >= 10 ? xCells : setXCells("10") } onChange={(e) => setXCells(e.target.value)} />
                <label style={{margin: "0px 10px"}}>Y:</label>
                <input type="number" min="10" max="20" value={yCells >= 10 ? yCells : setYCells("10")} onChange={(e) => setYCells(e.target.value)} />
                <input type="submit" onClick={saveTable} value="submit" />
            </div>
            
        </div>
    );
}
 
export default StaffRestaurantSeating;