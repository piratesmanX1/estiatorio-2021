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
    $selectedDate = mysqli_real_escape_string($conn, $_POST["selectedDate"]);

    // Check the email is in use or not
    $CEMAIL = "SELECT * FROM user WHERE email = '$email'";
    $CEMAILQ = mysqli_query($conn, $CEMAIL);
    // Check the username is in use or not
    $CUSERNAME = "SELECT * FROM user WHERE username = '$username'";
    $CUSERNAMEQ = mysqli_query($conn, $CUSERNAME);

    if(file_exists($_FILES['image']['tmp_name']) || is_uploaded_file($_FILES['image']['tmp_name'])) {
        // Define Photo Uploads' path and variables //
        $target_dir = "assets/image/uploaded_img/";
        $target_file = $target_dir . basename($_FILES["image"]["name"]);
        $imageFileType = pathinfo ($target_file, PATHINFO_EXTENSION);
        //check if image file is a actual image or fake image
        $check = getimagesize($_FILES["image"]["tmp_name"]);
        if($check == false)  {
            echo "Registration process halted: File is not an image file.";
        }
        //Allow certain file formats
        if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif" ) {
            echo "Registration process halted: Only JPG, JPEG, PNG & GIF files are allowed.";
        }
    } else {
        $target_file = NULL;
    }

    // Taking the current time 
    date_default_timezone_set("Etc/GMT-8");
    $now = date("Y-m-d H:i:s");

    // Begin the registration procedure
    // if email not used by any user yet
    if (mysqli_num_rows($CEMAILQ) < 1) {
        // if username is still available
        if (mysqli_num_rows($CUSERNAMEQ) < 1) {
            // if both username and email are available, then proceed to register the account
            // if role registration is customer, straightaway register it as active
            if ($role == 1) {
                $status = 0;
            } else {
                // if the role registration is a staff, set it as pending (2)
                $status = 2;
            }
            // Registration query
            $REGACC = "INSERT INTO user (`profile_image`, `username`, `password`, `email`, `first_name`, `last_name`, `phone_number`, `dob`, `role`, `status`, `registered_date`, `last_login`, `gender`) 
                       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";  

            // providing a new unique name by randomly generating the filename before saving into server
            $uploadtarget = '../../public/assets/image/uploaded_img/';
            $temp = explode(".", $_FILES["image"]["name"]);
            $newfilename = round(microtime(true)) . '.' . end($temp);
            $uploadtarget = $uploadtarget . $newfilename; 
            
            // defining $newtargetfile for saving into database later
            $newtarget_file = $target_dir . $newfilename;

            //Writes the photo to the server 
            if(move_uploaded_file($_FILES['image']['tmp_name'], $uploadtarget)) { 
                // if the image successfully uploaded into the server then proceed to save the changes
                $md5pw = md5($password);

                $stmt = $conn->prepare($REGACC);
                $stmt->bind_param("sssssssssssss", $newtarget_file, $username, $md5pw, $email, $firstName, $lastName, $phoneNo, $selectedDate, $role, $status, $now, `null`, $gender);
                $stmt->execute();

                if (($stmt->error) == false) {
                    // if there is no error then proceed to end the previous statement
                    $stmt->close();
                    // if we have reached this point then the registration is a success, return true back to Axious
                    echo true;
                } else {
                    // if the insertion failed, something went wrong
                    echo "Registration failed: Possible error: ".mysqli_error($conn);
                }
            } else { 
                // if it failed for some reason
                echo "Registration halted: Image upload failed, please try again.";
            }
        } else {
            echo "Registration halted: Username already under usage.";
        }
    } else {
        echo "Registration halted: Email already under usage.";
    }
?>