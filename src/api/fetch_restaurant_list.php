<?php
    // including the conn.php to establish connection with database
    include "./conn.php";
    
    // inclduing the core.php to prevent errors related with CORS policy from occurring
    include "./core.php";

    // fetch all data     
    $FETCHDATA = "SELECT restaurant.restaurant_id, restaurant.restaurant_name, user.first_name, user.last_name, user.email, restaurant.status, restaurant.seat_capacity 
                  FROM `restaurant` INNER JOIN user 
                  ON restaurant.user_id = user.user_id";
    $FETCHDATAQ = mysqli_query($conn, $FETCHDATA);

    if (mysqli_num_rows($FETCHDATAQ) < 1) {
        // if there is no data 
        echo "Data is unable to be fetched, might be caused by the lack of existing records.";
    } else {
        // if there is data
        // fetching the data into JSON array
        while ($row = mysqli_fetch_array($FETCHDATAQ)) {
            // save into JSON array
            $json_array[] = $row;
        }

        echo json_encode($json_array);
    }
?>
