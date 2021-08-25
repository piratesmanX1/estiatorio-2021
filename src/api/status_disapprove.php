<?php
    // including the conn.php to establish connection with database
    include "./conn.php";
    
    // inclduing the core.php to prevent errors related with CORS policy from occurring
    include "./core.php";

    $user_id = mysqli_real_escape_string($conn, $_POST["user_id"]);
    $status = mysqli_real_escape_string($conn, $_POST["status"]);
    $admin_id = mysqli_real_escape_string($conn, $_POST["admin_id"]);
    
    $receiverMail = mysqli_real_escape_string($conn, $_POST["email"]);

    // Taking the current time 
    date_default_timezone_set("Etc/GMT-8");
    $now = date("Y-m-d H:i:s");

    // update data
    $DELETEDATA = "DELETE FROM user WHERE `user_id` = ?";

    // proceed to update on the account info
    $stmt = $conn->prepare($DELETEDATA);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    
    if (($stmt->error) == false) {
        // if there is no error occurred, then the account info has been updated. Update the log as well
        $stmt->close();

        $mailSubject = 2;
        $boolMail = false;

        // return true or false will be done in mail.php
        include "mail.php";
    } else {
        // if the update failed, something went wrong
        echo "User information deletion failed. Possible error: ".mysqli_error($conn);
    }
?>