<?php
    // including the conn.php to establish connection with database
    include "./conn.php";
    
    // inclduing the core.php to prevent errors related with CORS policy from occurring
    include "./core.php";

    // fetch all data 
    $user_id = mysqli_real_escape_string($conn, $_POST["user_id"]);
    $FETCHDATA = "SELECT * FROM `restaurant` WHERE `user_id` = $user_id";
    $FETCHDATAQ = mysqli_query($conn, $FETCHDATA);

    if (mysqli_num_rows($FETCHDATAQ) < 1) {
        // if there is no data 
        return false;
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