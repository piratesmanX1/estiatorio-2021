<?php
    // including the conn.php to establish connection with database
    include "./conn.php";
        
    // inclduing the core.php to prevent errors related with CORS policy from occurring
    include "./core.php";

    // Target based on username and email
    $username = mysqli_real_escape_string($conn, $_POST["username"]);
    $email = mysqli_real_escape_string($conn, $_POST["email"]);

    // Check whether the related user with the email and username exist or not
    $CUSER = "SELECT * FROM user WHERE username = '$username' AND email = '$email'";
    $CUSERQ = mysqli_query($conn, $CUSER);

    function randomPassword() {
        $alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        $pass = array(); //remember to declare $pass as an array
        $alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
        for ($i = 0; $i < 8; $i++) {
            $n = rand(0, $alphaLength);
            $pass[] = $alphabet[$n];
        }
        return implode($pass); //turn the array into a string
    }
    
    if (mysqli_num_rows($CUSERQ) > 0) {
        // if the related user found, update the user password with a randomized password and send an email to alert them the new password
        // Update account password query
        $ACCPASS = "UPDATE user SET `password` = ? WHERE username = ? AND email = ?";
        
        // randomized password
        $randomized_pw = randomPassword();
        $new_randomized_pw = md5($randomized_pw);

        // first record this changes into account log
        $stmt = $conn->prepare($ACCPASS);
        $stmt->bind_param("sss", $new_randomized_pw, $username, $email);
        $stmt->execute();

        if (($stmt->error) == false) {
            // if there is no error then proceed to end the previous statement
            $stmt->close();
            
            // trigger the email with the related variables
            $mailSubject = 3;
            $newPw =  $randomized_pw;

            // return true or false will be done in mail.php
            include "mail.php";
        } else {
            // if the insertion failed, something went wrong
            echo "Account password reset failed. Possible error: ".mysqli_error($conn);
        }
    } else {
        echo "Username or email may be wrong, please try again.";
    }
?>