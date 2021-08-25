<?php
    // including the conn.php to establish connection with database
    include "./conn.php";
    
    // inclduing the core.php to prevent errors related with CORS policy from occurring
    include "./core.php";

    $region_id = mysqli_real_escape_string($conn, $_POST["region_id"]);

    // update data
    $DELETEDATA = "DELETE FROM region WHERE `region_id` = ?";

    // first check whether there is any restaurant under the region or not
    // fetch all data: find if there is any restaurant under the region, regardless of the status
    $FETCHDATA = "SELECT * FROM restaurant WHERE `region_id` = $region_id";
    $FETCHDATAQ = mysqli_query($conn, $FETCHDATA);

    if (mysqli_num_rows($FETCHDATAQ ) < 1) {
        // if there is no restaurant under the region, then proceed with the deletion
        // proceed to update on the account info
        $stmt = $conn->prepare($DELETEDATA );
        $stmt->bind_param("i", $region_id);
        $stmt->execute();
        
        if (($stmt->error) == false) {
            // if there is no error occurred, then the account info has been updated. Return true back to Axious
            $stmt->close();

            echo true;
        } else {
            // if the update failed, something went wrong
            echo "Region deletion failed. Possible error: ".mysqli_error($conn);
        }
    } else {
        echo "Region deletion request is rejected due to the existing restaurant under the region.";
    }

    
?>