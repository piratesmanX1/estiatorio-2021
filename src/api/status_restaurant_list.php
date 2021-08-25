<?php
    // including the conn.php to establish connection with database
    include "./conn.php";
    
    // inclduing the core.php to prevent errors related with CORS policy from occurring
    include "./core.php";

    // fetch all data 
    $restaurant_id = mysqli_real_escape_string($conn, $_POST["restaurant_id"]);
    $status = mysqli_real_escape_string($conn, $_POST["status"]);

    // if there are none then allow the procedure to proceed
    // update data
    $EDITDATA = "UPDATE restaurant SET `status` = ? WHERE `restaurant_id` = ?";

    // first check whether there are any ongoing/active reservation under the restaurant or not
    $CHECKRES = "SELECT * FROM reservation_log WHERE `status` = 1 AND `restaurant_id` = $restaurant_id";
    $CHECKRESQ = mysqli_query($conn, $CHECKRES);

    if (mysqli_num_rows($CHECKRESQ) < 1) {
        // if there are none then allow the procedure to proceed
        // proceed to update on the restaurant info
        $stmt = $conn->prepare($EDITDATA);
        $stmt->bind_param("si", $status, $restaurant_id);
        $stmt->execute();
        
        if (($stmt->error) == false) {
            // if there is no error occurred, then the restaurant info has been updated
            $stmt->close();

            echo true;
        } else {
            // if the update failed, something went wrong
            echo "Restaurant information update failed. Possible error: ".mysqli_error($conn);
        }
    } else {
        // if there is active reservation, then we will see if the intended update status is to activate the restaurant or not
        if ($status == 0) {
            // if its trying to activate it then allow the procedure
            // proceed to update on the restaurant info
            $stmt = $conn->prepare($EDITDATA);
            $stmt->bind_param("si", $status, $restaurant_id);
            $stmt->execute();
            
            if (($stmt->error) == false) {
                // if there is no error occurred, then the restaurant info has been updated
                $stmt->close();

                echo true;
            } else {
                // if the update failed, something went wrong
                echo "Restaurant information update failed. Possible error: ".mysqli_error($conn);
            }
        } else {
            // if its trying to deactivate then reject it
            echo "Restaurant status update request rejected due to existing/ongoing reservations.";
        }
    }
?>
