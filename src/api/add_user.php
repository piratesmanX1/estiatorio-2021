<?php
    // including the conn.php to establish connection with database
    include "./conn.php";
    
    // inclduing the core.php to prevent errors related with CORS policy from occurring
    include "./core.php";

    $username = mysqli_real_escape_string($conn, $_POST["username"]);
    $password = mysqli_real_escape_string($conn, $_POST["password"]);
    $firstName = mysqli_real_escape_string($conn, $_POST["firstName"]);
    $lastName = mysqli_real_escape_string($conn, $_POST["lastName"]);
    $email = mysqli_real_escape_string($conn, $_POST["email"]);
    $phoneNo = mysqli_real_escape_string($conn, $_POST["phoneNo"]);
    $gender = mysqli_real_escape_string($conn, $_POST["gender"]);
    $role = mysqli_real_escape_string($conn, $_POST["role"]);

    $md5pw = md5($password);

    // update data
    $ADDDATA = "INSERT INTO user (`username`, `profile_image`, `password`, `email`, `first_name`, `last_name`, `phone_number`, `role`, `status`, `gender`) 
                VALUES (?,?,?,?,?,?,?,?,?,?)";  

    // Check the email is in use or not
    $CEMAIL = "SELECT * FROM user WHERE email = '$email'";
    $CEMAILQ = mysqli_query($conn, $CEMAIL);
    // Check the username is in use or not
    $CUSERNAME = "SELECT * FROM user WHERE username = '$username'";
    $CUSERNAMEQ = mysqli_query($conn, $CUSERNAME);

    // if email not used by any user yet
    if (mysqli_num_rows($CEMAILQ) < 1) {
        // if email not used by any user yet
        if (mysqli_num_rows($CUSERNAMEQ) < 1) {
            // proceed to update on the account info
            $status = "0";
            $profile = "assets/image/P00.png";
            $stmt = $conn->prepare($ADDDATA);
            $stmt->bind_param("ssssssssss", $username, $profile, $md5pw, $email, $firstName, $lastName, $phoneNo, $role, $status, $gender);
            $stmt->execute();
            
            if (($stmt->error) == false) {
                // if there is no error occurred, then the account info has been updated. Return true back to Axious
                $stmt->close();

                echo true;
            } else {
                // if the update failed, something went wrong
                echo "User information insertion failed. Possible error: ".mysqli_error($conn);
            }
        } else {
            echo "Update halted: Username already under usage.";
        }
    } else {
        echo "Update halted: Email already under usage.";
    }
?>