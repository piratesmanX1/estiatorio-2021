<?php
    // including the conn.php to establish connection with database
    include "./conn.php";
    
    // inclduing the core.php to prevent errors related with CORS policy from occurring
    include "./core.php";

    // fetch all data 
    $keywords = mysqli_real_escape_string($conn, $_POST["keywords"]);
    $region = mysqli_real_escape_string($conn, $_POST["region"]);

    if (isset($_POST["limit"])) {
        $limit = mysqli_real_escape_string($conn, $_POST["limit"]);
    } else {
        $limit = 0;
    }
    
    // defining the amount of item per page
    $items = 5;

    if ($limit > 0) {
        // setting the nth of items showing from database based on the pagination selected
        $limit = $limit * $items;
    } else {
        $limit = 0;
    }

    // determine the state of the fetching based on the given data
    if (($keywords == "") && ($region == 0)) {
        $FETCHDATA = "SELECT * FROM `restaurant` WHERE `status` = 0 LIMIT $limit, $items";
    } else if (($keywords == "") && ($region > 0)) {
        $FETCHDATA = "SELECT * FROM `restaurant` WHERE `region_id` = $region AND `status` = 0 LIMIT $limit, $items";
    } else if (($keywords != "") && ($region == 0)) {
        $FETCHDATA = "SELECT * FROM `restaurant` WHERE `restaurant_name` AND `status` = 0 LIKE '%$keywords%' LIMIT $limit, $items";
    } else if (($keywords != "") && ($region > 0)) {
        $FETCHDATA = "SELECT * FROM `restaurant` WHERE `restaurant_name` AND `status` = 0 LIKE '%$keywords%' AND `region_id` = $region LIMIT $limit, $items";
    } else {
        // default search
        $FETCHDATA = "SELECT * FROM `restaurant` LIMIT $limit, $items";
    }

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