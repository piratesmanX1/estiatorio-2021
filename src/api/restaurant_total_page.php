<?php
    // including the conn.php to establish connection with database
    include "./conn.php";
    
    // inclduing the core.php to prevent errors related with CORS policy from occurring
    include "./core.php";

    // fetch all data 
    $keywords = mysqli_real_escape_string($conn, $_POST["keywords"]);
    $region = mysqli_real_escape_string($conn, $_POST["region"]);

    // defining the amount of item per page
    $items = 5;

    if (($keywords == "") && ($region == 0)) {
        $FETCHDATA = "SELECT COUNT(*) AS `total_page` FROM `restaurant`";
    } else if (($keywords == "") && ($region > 0)) {
        $FETCHDATA = "SELECT COUNT(*) AS `total_page` FROM `restaurant` WHERE `region_id` = $region";
    } else if (($keywords != "") && ($region == 0)) {
        $FETCHDATA = "SELECT COUNT(*) AS `total_page` FROM `restaurant` WHERE `restaurant_name` LIKE '%$keywords%'";
    } else if (($keywords != "") && ($region > 0)) {
        $FETCHDATA = "SELECT COUNT(*) AS `total_page` FROM `restaurant` WHERE `restaurant_name` LIKE '%$keywords%' AND `region_id` = $region";
    } else {
        // default search
        $FETCHDATA = "SELECT COUNT(*) AS `total_page` FROM `restaurant`";
    }

    $FETCHDATA = "SELECT COUNT(*) AS `total_page` FROM `restaurant`";
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