<?php
    // including the conn.php to establish connection with database
    include "./conn.php";
    
    // inclduing the core.php to prevent errors related with CORS policy from occurring
    include "./core.php";

    if (isset($_POST["user_id"])) {
        $user_id = mysqli_real_escape_string($conn, $_POST["user_id"]);
    }
    
    // Taking the current time 
    date_default_timezone_set("Etc/GMT-8");
    $now = date("Y-m-d H:i:s");

    // Update account date query
    $ACCLOGIN = "UPDATE user SET `last_login` = ? WHERE `user_id` = ?";

    // proceed to update on the account info
    $stmt = $conn->prepare($ACCLOGIN);
    $stmt->bind_param("si", $now, $user_id);
    $stmt->execute();

    if (($stmt->error) == false) {
        // if there is no error occurred, then the account info has been updated. Return true back to Axious
        $stmt->close();

        // echo true;
    } else {
        // if the update failed, something went wrong
        // echo "Account last login date update failed. Possible error: ".mysqli_error($conn);
    }
?>