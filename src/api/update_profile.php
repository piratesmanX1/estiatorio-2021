<?php
    // including the conn.php to establish connection with database
    include "./conn.php";
        
    // inclduing the core.php to prevent errors related with CORS policy from occurring
    include "./core.php";


    $user_id = mysqli_real_escape_string($conn, $_POST["user_id"]);
    $column_name = mysqli_real_escape_string($conn, $_POST["column_name"]);

    if ($column_name == "password") {
        $column_value = mysqli_real_escape_string($conn, $_POST["column_value"]);
        $column_value = md5($column_value);
    } else if ($column_name == "profile_image") {
        // to store the data in JSON format to fit into ReactJS
        $json_array = array();

        // file validation on the file if the changes attempt is on profile image
        if(file_exists($_FILES['column_value']['tmp_name']) || is_uploaded_file($_FILES['column_value']['tmp_name'])) {
            // Define Photo Uploads' path and variables //
            $target_dir = "assets/image/uploaded_img/";
            $target_file = $target_dir . basename($_FILES["column_value"]["name"]);
            $imageFileType = pathinfo ($target_file, PATHINFO_EXTENSION);
            //check if image file is a actual image or fake image
            $check = getimagesize($_FILES["column_value"]["tmp_name"]);
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
        
        // providing a new unique name by randomly generating the filename before saving into server
        $uploadtarget = '../../public/assets/image/uploaded_img/';
        $temp = explode(".", $_FILES["column_value"]["name"]);
        $newfilename = round(microtime(true)) . '.' . end($temp);
        $uploadtarget = $uploadtarget . $newfilename; 
        
        // defining $newtargetfile for saving into database later
        $newtarget_file = $target_dir . $newfilename;

        //Writes the photo to the server 
        if(move_uploaded_file($_FILES['column_value']['tmp_name'], $uploadtarget)) { 
            // if the image successfully uploaded into the server then proceed to save the changes
            $column_value = $newtarget_file;
        } else { 
            // if it failed for some reason
            echo "Profile image update halted: Image upload failed, please try again.";
        }
    } else {
        $column_value = mysqli_real_escape_string($conn, $_POST["column_value"]);
    }

    if ($column_value) {
        // Update account information query
        $ACCINFO = "UPDATE user SET `$column_name` = ? WHERE `user_id` = ?";

        // proceed to update on the account info
        $stmt = $conn->prepare($ACCINFO);
        $stmt->bind_param("si", $column_value, $user_id);
        $stmt->execute();
        
        if (($stmt->error) == false) {
            // if there is no error occurred, then the account info has been updated. Return true back to Axious
            $stmt->close();

            if ($column_name == "profile_image") {
                // save into JSON array
                $json_array["profile_image"]= $column_value;
                
                echo json_encode($json_array);
            } else {
                echo true;
            }
        } else {
            // if the update failed, something went wrong
            echo "Account information update failed. Possible error: ".mysqli_error($conn);
        }
    }
?>