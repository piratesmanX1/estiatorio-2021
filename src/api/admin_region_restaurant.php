<?php
    // including the conn.php to establish connection with database
    include "./conn.php";
    
    // inclduing the core.php to prevent errors related with CORS policy from occurring
    include "./core.php";

    // fetch all data of the region list
    $FETCHDATA = "SELECT * FROM region";
    $FETCHDATAQ = mysqli_query($conn, $FETCHDATA);

    if (mysqli_num_rows($FETCHDATAQ ) < 1) {
        // if there is no data 
        echo "Region list data unable to be fetched, please try again.";
    } else {
        // if there is data on region list
        // fetching the data into JSON array
        while ($row = mysqli_fetch_array($FETCHDATAQ)) {
            // save into JSON array
            $json_array[] = $row;
        }

        // then we proceed to find the total number of restaurant specifically based on the region_id
        $FETCHDATA = "SELECT COUNT(*) AS `total_restaurant` FROM `restaurant` WHERE `region_id` = ?";

        // put into forloop to fetch the value specifically based on the region_id
        $length = count($json_array);

        for ($n = 0; $n < $length; $n++) {
            // if not, then allow the procedure
            // first record this changes into account log
            $stmt = $conn->prepare($FETCHDATA);
            $stmt->bind_param("i", $json_array[$n]["region_id"]);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if (($stmt->error) == false) {
                // if there is no error, we check whether there are any data row returned or not
                if($result->num_rows > 0) {
                    // if there is data then proceed to take the COUNT(*) value and assign to the respective region
                    while ($row = $result->fetch_assoc()) {
                        // save into JSON array
                        $json_array[$n]["total_restaurant"] = $row["total_restaurant"];
                    }
                } else {
                    // if there are none then set it "-" to the respective region_id
                    $json_array[$n]["total_restaurant"] = "-";
                }

                // proceed to end the previous statement
                $stmt->close();
            } else {
                // if the insertion failed, something went wrong
                $stmt->close();
                echo "Region restaurant data fetch error: ".mysqli_error($conn);
            }
        }
        // then we find the total reservation made based on the related region
        $FETCHDATA = "SELECT *, COUNT(*) as total_reservation 
                      FROM reservation_log INNER JOIN restaurant
                      ON reservation_log.restaurant_id = restaurant.restaurant_id
                      GROUP BY region_id";
        $FETCHDATAQ = mysqli_query($conn, $FETCHDATA);

        $length = count($json_array);
        if (mysqli_num_rows($FETCHDATAQ) < 1) {
            // if there is no data, assign it as "-" on each array of the $json_array
            for ($i = 0; $i < $length; $i++) {
                $json_array[$i]["total_reservation"] = "-";
            }
        } else {
            // if there is data, then take the value and assign into $json_array accordingly
            while ($row = mysqli_fetch_array($FETCHDATAQ)) {
                // save into JSON array
                $temp_array[] = $row;
            }
            $temp_length = count($temp_array);
            for ($i = 0; $i < $length; $i++) {
                for ($j = 0; $j < $temp_length; $j++) {
                    if ($json_array[$i]["region_id"] == $temp_array[$j]["region_id"]) {
                        $json_array[$i]["total_reservation"] = $temp_array[$j]["total_reservation"];

                        continue;
                    } else {
                        $json_array[$i]["total_reservation"] = "-";
                    }
                } 
            }
        }
        echo json_encode($json_array);
    }
?>