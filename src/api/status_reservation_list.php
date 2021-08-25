<?php
    // including the conn.php to establish connection with database
    include "./conn.php";
    
    // inclduing the core.php to prevent errors related with CORS policy from occurring
    include "./core.php";

    // fetch all data 
    $reservation_id = mysqli_real_escape_string($conn, $_POST["reservation_id"]);
    $status = mysqli_real_escape_string($conn, $_POST["status"]);
    $email = mysqli_real_escape_string($conn, $_POST["email"]);

    // if there are none then allow the procedure to proceed
    // update data
    $EDITDATA = "UPDATE reservation_log SET `status` = ? WHERE `reservation_id` = ?";

    // proceed to update on the account info
    $stmt = $conn->prepare($EDITDATA);
    $stmt->bind_param("si", $status, $reservation_id);
    $stmt->execute();
    
    if (($stmt->error) == false) {
        // if there is no error occurred, then the reservation info has been updated. Send the mail to the related user and alert them
        $stmt->close();

        $mailSubject = 4;
        $reservationId = $reservation_id;
        $reservationStatus = $status;
        $receiverMail = $email;

        // return true or false will be done in mail.php
        include "mail.php";
    } else {
        // if the update failed, something went wrong
        echo "Reservation log information update failed. Possible error: ".mysqli_error($conn);
    }
?>
