<?php
    // including the conn.php to establish connection with database
    include "./conn.php";
    
    // inclduing the core.php to prevent errors related with CORS policy from occurring
    include "./core.php";

    $region_id = mysqli_real_escape_string($conn, $_POST["region_id"]);

    // fetch all data
    $FETCHDATA = "SELECT * FROM region WHERE region_id = $region_id";
    $FETCHDATAQ = mysqli_query($conn, $FETCHDATA);

    if (mysqli_num_rows($FETCHDATAQ ) < 1) {
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