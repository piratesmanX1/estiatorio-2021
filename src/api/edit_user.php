<?php
    // including the conn.php to establish connection with database
    include "./conn.php";
    
    // inclduing the core.php to prevent errors related with CORS policy from occurring
    include "./core.php";

    $user_id = mysqli_real_escape_string($conn, $_POST["user_id"]);
    $email = mysqli_real_escape_string($conn, $_POST["email"]);
    $password = mysqli_real_escape_string($conn, $_POST["password"]);
    $md5pw = md5($password);

    // update data
    $EDITDATA = "UPDATE user SET `email` = ?, `password` = ? WHERE `user_id` = ?";

    // first check whether email already used or not
    $CEMAIL = "SELECT * FROM user WHERE email = '$email'";
    $CEMAILQ = mysqli_query($conn, $CEMAIL);

    // if email not used by any user yet
    if (mysqli_num_rows($CEMAILQ) < 1) {
        // proceed to update on the account info
        $stmt = $conn->prepare($EDITDATA);
        $stmt->bind_param("ssi", $email, $md5pw, $user_id);
        $stmt->execute();
        
        if (($stmt->error) == false) {
            // if there is no error occurred, then the account info has been updated. Return true back to Axious
            $stmt->close();

            echo true;
        } else {
            // if the update failed, something went wrong
            echo "User information update failed. Possible error: ".mysqli_error($conn);
        }
    } else {
        echo "Update halted: Email already under usage.";
    }
?>