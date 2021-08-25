<?php
    // including the conn.php to establish connection with database
    include "./conn.php";
    
    // inclduing the core.php to prevent errors related with CORS policy from occurring
    include "./core.php";

    $region_id = mysqli_real_escape_string($conn, $_POST["region_id"]);
    $region_name = mysqli_real_escape_string($conn, $_POST["region_name"]);

    // update data
    $EDITDATA = "UPDATE region SET `region_name` = ? WHERE `region_id` = ?";

    // proceed to update on the account info
    $stmt = $conn->prepare($EDITDATA);
    $stmt->bind_param("si", $region_name, $region_id);
    $stmt->execute();
    
    if (($stmt->error) == false) {
        // if there is no error occurred, then the account info has been updated. Return true back to Axious
        $stmt->close();

        echo true;
    } else {
        // if the update failed, something went wrong
        echo "Region information update failed. Possible error: ".mysqli_error($conn);
    }
?>