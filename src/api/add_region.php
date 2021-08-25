<?php
    // including the conn.php to establish connection with database
    include "./conn.php";
    
    // inclduing the core.php to prevent errors related with CORS policy from occurring
    include "./core.php";

    $region_name = mysqli_real_escape_string($conn, $_POST["region_name"]);

    // update data
    $ADDDATA = "INSERT INTO region (`region_name`) VALUES (?)";

    // proceed to update on the account info
    $stmt = $conn->prepare($ADDDATA);
    $stmt->bind_param("s", $region_name);
    $stmt->execute();
    
    if (($stmt->error) == false) {
        // if there is no error occurred, then the account info has been updated. Return true back to Axious
        $stmt->close();

        echo true;
    } else {
        // if the update failed, something went wrong
        echo "Region information insertion failed. Possible error: ".mysqli_error($conn);
    }
?>