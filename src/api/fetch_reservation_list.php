<?php
    // including the conn.php to establish connection with database
    include "./conn.php";
    
    // inclduing the core.php to prevent errors related with CORS policy from occurring
    include "./core.php";

    // fetch all data 
    $restaurant_id = mysqli_real_escape_string($conn, $_POST["restaurant_id"]);
    $FETCHDATA = "SELECT reservation_log.reservation_id, user.first_name, user.last_name, reservation_log.reservation_time, user.email, user.phone_number, reservation_log.status FROM `reservation_log` INNER JOIN user
                  ON reservation_log.user_id = user.user_id
                  WHERE reservation_log.restaurant_id = $restaurant_id
                  ORDER BY reservation_log.reservation_time DESC";
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
