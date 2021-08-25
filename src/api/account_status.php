<?php
    // including the conn.php to establish connection with database
    include "./conn.php";
        
    // inclduing the core.php to prevent errors related with CORS policy from occurring
    include "./core.php";

    $user_id = mysqli_real_escape_string($conn, $_POST["user_id"]);
    $status = mysqli_real_escape_string($conn, $_POST["status"]);
    $decider_id = mysqli_real_escape_string($conn, $_POST["decider_id"]);

    // Taking the current time 
    date_default_timezone_set("Etc/GMT-8");
    $now = date("Y-m-d H:i:s");
    
    // Account log record changes query
    $ACCLOG = "INSERT INTO account_log (`log_status`, `user_id`, `affected_date`, `decider_id`) 
               VALUES (?,?,?,?)";  
    // Update account status query
    $ACCSTAT = "UPDATE user SET `status` = ? WHERE `user_id` = ?";

    // first check whether the user having any active/ongoing reservation or not 
    $CHECKRES = "SELECT * FROM `reservation_log` WHERE `user_id` = $user_id AND `status` = 1";
    $CHECKRESQ = mysqli_query($conn, $CHECKRES);

    // and check whether the user having any active/ongoing restaurant or not 
    $CHECKRESTAURANT = "SELECT * FROM `restaurant` WHERE `user_id` = $user_id AND `status` = 0";
    $CHECKRESTAURANTQ = mysqli_query($conn, $CHECKRESTAURANT);

    if ((mysqli_num_rows($CHECKRESQ) < 1) && (mysqli_num_rows($CHECKRESTAURANTQ) < 1)) {
        // if there are none then allow the procedure to proceed
        // first record this changes into account log
        $stmt = $conn->prepare($ACCLOG);
        $stmt->bind_param("sisi", $status, $user_id, $now, $decider_id);
        $stmt->execute();

        if (($stmt->error) == false) {
            // if there is no error then proceed to end the previous statement
            $stmt->close();
            
            // then proceed to update on the account status
            $stmt = $conn->prepare($ACCSTAT);
            $stmt->bind_param("si", $status, $user_id);
            $stmt->execute();
            
            if (($stmt->error) == false) {
                // if there is no error occurred, then the account log has been inserted. Return true back to Axious
                $stmt->close();

                echo true;
            } else {
                // if the update failed, something went wrong
                echo "Account update failed. Possible error: ".mysqli_error($conn);
            }
        } else {
            // if the insertion failed, something went wrong
            echo "Account log insertion failed. Possible error: ".mysqli_error($conn);
        }
    } else {
        // if the intended status is to deactivate it
        if ($status == 1) {
            // if there is, reject the deactivation proposal
            echo "Account status update rejected due to existing ongoing reservation/restaurant. Please do cancel the related data first if you wish to update your account status.";
        } else {
            // if not, then allow the procedure
            // first record this changes into account log
            $stmt = $conn->prepare($ACCLOG);
            $stmt->bind_param("sisi", $status, $user_id, $now, $decider_id);
            $stmt->execute();

            if (($stmt->error) == false) {
                // if there is no error then proceed to end the previous statement
                $stmt->close();
                
                // then proceed to update on the account status
                $stmt = $conn->prepare($ACCSTAT);
                $stmt->bind_param("si", $status, $user_id);
                $stmt->execute();
                
                if (($stmt->error) == false) {
                    // if there is no error occurred, then the account log has been inserted. Return true back to Axious
                    $stmt->close();

                    echo true;
                } else {
                    // if the update failed, something went wrong
                    echo "Account update failed. Possible error: ".mysqli_error($conn);
                }
            } else {
                // if the insertion failed, something went wrong
                echo "Account log insertion failed. Possible error: ".mysqli_error($conn);
            }
        }
    }
?>