<?php
    // including the conn.php to establish connection with database
    include "./conn.php";
    
    // inclduing the core.php to prevent errors related with CORS policy from occurring
    include "./core.php";

    $user_id = mysqli_real_escape_string($conn, $_POST["user_id"]);
    $reservation_id = mysqli_real_escape_string($conn, $_POST["reservation_id"]);

    // update data
    $ACCINFO = "UPDATE reservation_log SET `status` = 2 WHERE `user_id` = ? AND `reservation_id` = ?";

    // first check whether the reservation already overdue or not
    // Taking the current time 
    date_default_timezone_set("Etc/GMT-8");
    $now = date("Y-m-d H:i:s");

    $FETCHDATA = "SELECT * FROM `reservation_log` WHERE `user_id` = $user_id AND `reservation_id` = $reservation_id";
    $FETCHDATAQ = mysqli_query($conn, $FETCHDATA);
    
    if (mysqli_num_rows($FETCHDATAQ) < 1) {
        // if there is no data 
        echo "Unable to fetch user reservation info, please try again.";
    } else {
         // if there is data
         while ($row = mysqli_fetch_array($FETCHDATAQ)) {
            // save into JSON array
            $reservation_time = $row["reservation_time"];
        }

        // start comparing the date
        $d1 = new DateTime($reservation_time);
        
        if ($reservation_time > $now) {
            // if the reservation time still later than the reservation itself, then it is allowed to cancel manually
            $mailSubject = 4;
            $reservationId = $reservation_id;
            $reservationStatus = 2;
        } else {
            // if the reservation already overdue and the user intended to cancel, it is not allowed as the reservation will be cancelled by the system automatically and penalized
            $mailSubject = 4;
            $reservationId = $reservation_id;
            $reservationStatus = 3;
        }
    }

    // proceed to update on the account info
    $stmt = $conn->prepare($ACCINFO);
    $stmt->bind_param("ii", $user_id, $reservation_id);
    $stmt->execute();
    
    if (($stmt->error) == false) {
        // if there is no error occurred, then the account info has been updated. Send the mail as well
        $stmt->close();

        // first find the email of the user who request for cancellation
        // fetch all data 
        $FETCHDATA = "SELECT * FROM `user` WHERE `user_id` = $user_id";
        $FETCHDATAQ = mysqli_query($conn, $FETCHDATA);

        if (mysqli_num_rows($FETCHDATAQ) < 1) {
            // if there is no data 
            echo "Mailer error: Unable to find the email of the user.";
        } else {
            // if there is data
            while ($row = mysqli_fetch_array($FETCHDATAQ)) {
                // save into JSON array
                $email = $row["email"];
            }
            
            $receiverMail = $email;
            // return true or false will be done in mail.php
            include "mail.php";
        }
    } else {
        // if the update failed, something went wrong
        echo "Reservation cancellation failed. Possible error: ".mysqli_error($conn);
    }
?>