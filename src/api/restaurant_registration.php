<?php
    // including the conn.php to establish connection with database
    include "./conn.php";
    
    // inclduing the core.php to prevent errors related with CORS policy from occurring
    include "./core.php";

    $restaurant_name = mysqli_real_escape_string($conn, $_POST["restaurant_name"]);
    $restaurant_description = mysqli_real_escape_string($conn, $_POST["restaurant_description"]);
    $restaurant_address = mysqli_real_escape_string($conn, $_POST["restaurant_address"]);
    $reservation_fee = mysqli_real_escape_string($conn, $_POST["reservation_fee"]);
    $seat_capacity = mysqli_real_escape_string($conn, $_POST["seat_capacity"]);
    $region_id = mysqli_real_escape_string($conn, $_POST["region_id"]);
    $user_id = mysqli_real_escape_string($conn, $_POST["user_id"]);

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

    // Registration query
    $REGACC = "INSERT INTO restaurant (`restaurant_logo`, `restaurant_name`, `restaurant_description`, `restaurant_address`, `reservation_fee`, `seat_capacity`, `status`, `region_id`, `user_id`) 
               VALUES (?,?,?,?,?,?,?,?,?)";

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
    $status = 0;
    $stmt = $conn->prepare($REGACC);
    $stmt->bind_param("sssssssii", $newtarget_file, $restaurant_name, $restaurant_description, $restaurant_address, $reservation_fee, $seat_capacity, $status, $region_id, $user_id);
    $stmt->execute();

    if (($stmt->error) == false) {
        // if there is no error then proceed to end the previous statement
        $stmt->close();
        // if we have reached this point then the registration is a success, return true back to Axious
        echo true;
    } else {
        // if the insertion failed, something went wrong
        echo "Restaurant Registration failed: Possible error: ".mysqli_error($conn);
    }
} else { 
    // if it failed for some reason
    echo "Restaurant Registration halted: Image upload failed, please try again.";
}
?>