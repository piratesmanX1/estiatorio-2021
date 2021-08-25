<?php
    // including the conn.php to establish connection with database
    include "./conn.php";
    
    // inclduing the core.php to prevent errors related with CORS policy from occurring
    include "./core.php";

    $username = mysqli_real_escape_string($conn, $_POST["username"]);
    $password = mysqli_real_escape_string($conn, $_POST["password"]);

    // Taking the current time 
    date_default_timezone_set("Etc/GMT-8");
    $now = date("Y-m-d H:i:s");

    // to receive the data in JSON format to fit into ReactJS
    $json_array = array();

    // Checking whether user credentials are valid or not
    $LOGIN = "SELECT * FROM user WHERE `username` = ? AND `password` = ?";

    $md5pw = md5($password);
    $stmt = $conn->prepare($LOGIN);
    $stmt->bind_param("ss", $username, $md5pw);
    $stmt->execute();
    $result = $stmt->get_result();

    if (($stmt->error) == false) {
        // if user data exist then proceed to store the data into JSON format and fetch to user
        if($result->num_rows > 0) {
            // fetching the data into JSON array
            while ($row = $result->fetch_assoc()) {
                // save into JSON array
                $json_array[] = $row;
            }
            
            //  we will check whether the user is currently active or not
            if ($json_array[0]["status"] == 0) {
                // if its active then return the JSON data 
                echo json_encode($json_array);
                $stmt->close();
                // first we will update the account's last login date
                // trigger with the related variables by assigning into $user_id
                $user_id = $json_array[0]["user_id"];
                include "login_date.php";
            } else {
                // if the user is not active
                echo "Login failed: Account is not active, please contact with administrator for more information.";
            }
        } else {
            return false;
        }
    } else {
        // if query execution failed, something must gone wrong
        echo "Login failed: Possible error: ".mysqli_error($conn);
    }
?>