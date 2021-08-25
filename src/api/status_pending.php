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
    $EDITDATA = "UPDATE user SET `status` = ? WHERE `user_id` = ?";

    // proceed to update on the account info
    $stmt = $conn->prepare($EDITDATA);
    $stmt->bind_param("si", $status, $user_id);
    $stmt->execute();
    
    if (($stmt->error) == false) {
        // if there is no error occurred, then the account info has been updated. Update the log as well
        $stmt->close();

        // Account log record changes query
        $ACCLOG = "INSERT INTO account_log (`log_status`, `user_id`, `affected_date`, `decider_id`) 
                   VALUES (?,?,?,?)";  
        // first record this changes into account log
        $stmt = $conn->prepare($ACCLOG);
        $stmt->bind_param("sisi", $status, $user_id, $now, $admin_id);
        $stmt->execute();

        if (($stmt->error) == false) {
            // if there is no error then proceed to end the previous statement
            $stmt->close();

            $mailSubject = 2;
            $boolMail = $status;

            // return true or false will be done in mail.php
            include "mail.php";
        } else {
            // if the update failed, something went wrong
            echo "Account update failed. Possible error: ".mysqli_error($conn);
        }
        
    } else {
        // if the update failed, something went wrong
        echo "User information update failed. Possible error: ".mysqli_error($conn);
    }
?>