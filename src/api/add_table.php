<?php
    // including the conn.php to establish connection with database
    include "./conn.php";
    
    // inclduing the core.php to prevent errors related with CORS policy from occurring
    include "./core.php";

    $totalX = mysqli_real_escape_string($conn, $_POST["sizeX"]);
    $totalY = mysqli_real_escape_string($conn, $_POST["sizeY"]);
    $positionX = mysqli_real_escape_string($conn, $_POST["positionX"]);
    $positionY = mysqli_real_escape_string($conn, $_POST["positionY"]);
    $user_id = mysqli_real_escape_string($conn, $_POST["user_id"]);
    $restaurant_id;

    // first we check whether the user have a restaurant already or not
    $FETCHDATA = "SELECT * FROM `restaurant` WHERE `user_id` = $user_id";
    $FETCHDATAQ = mysqli_query($conn, $FETCHDATA);

    if (mysqli_num_rows($FETCHDATAQ) > 0) {
        // else try to obtain the related restaurant_id for future uses
        if ($row = mysqli_fetch_array($FETCHDATAQ)) {
            $restaurant_id = $row["restaurant_id"];
        }
        
        // after fetched the restaurant_id, we will then check whether the table data already existed or not: table size and table setting
        // table_size first
        $FETCHDATA = "SELECT * FROM `table_size` WHERE `restaurant_id` = $restaurant_id";
        $FETCHDATAQ = mysqli_query($conn, $FETCHDATA);

        if (mysqli_num_rows($FETCHDATAQ) > 0) {
            // if its already defined, then proceed to check whether the size are the same or not
            if ($row = mysqli_fetch_array($FETCHDATAQ)) {
                // this is to confirm whether the data are still accurate
                $savedTotalX = $row["totalX"];
                $savedTotalY = $row["totalY"];
            }

            // we need to compare it as it might be the loop from map() in Axious
            if (($totalX == $savedTotalX) && ($totalY == $savedTotalY)) {
                // if its the same size we proceed to insert into the table setting data
                $ADDDATA = "INSERT INTO table_setting (`positionX`, `positionY`, `restaurant_id`) VALUES (?,?,?)";

                // proceed to update on the account info
                $stmt = $conn->prepare($ADDDATA);
                $stmt->bind_param("ssi", $positionX, $positionY, $restaurant_id);
                $stmt->execute();

                if (($stmt->error) == false) {
                    // if there is no error occurred, then the account info has been updated. Return true back to Axious
                    $stmt->close();
            
                    echo true;
                } else {
                    // if the update failed, something went wrong
                    echo "Table setting data insertion failed. Possible error: ".mysqli_error($conn);
                }
            } else {
                // if its not the same, delete it and replace it
                $DELETEDATA = "DELETE FROM table_size WHERE `restaurant_id` = ?";

                // proceed to update on the account info
                $stmt = $conn->prepare($DELETEDATA);
                $stmt->bind_param("i", $restaurant_id);
                $stmt->execute();
                
                if (($stmt->error) == false) {
                    // if there is no error occurred
                    $stmt->close();

                    // delete any possible related data in table_settings as well if possible
                    $DELETEDATA = "DELETE FROM table_setting WHERE `restaurant_id` = ?";

                    // proceed to update on the account info
                    $stmt = $conn->prepare($DELETEDATA);
                    $stmt->bind_param("i", $restaurant_id);
                    $stmt->execute();
                    
                    if (($stmt->error) == false) {
                        // if there is no error occurred
                        $stmt->close();

                        // then finally insert the current version of size data
                        $ADDDATA = "INSERT INTO table_size (`totalX`, `totalY`, `restaurant_id`) VALUES (?,?,?)";

                        // proceed to update on the account info
                        $stmt = $conn->prepare($ADDDATA);
                        $stmt->bind_param("ssi", $totalX, $totalY, $restaurant_id);
                        $stmt->execute();

                        if (($stmt->error) == false) {
                            // if there is no error occurred, then the account info has been updated. Return true back to Axious
                            $stmt->close();

                            // then finally we will go add the related table_settings data
                            // if its the same size we proceed to insert into the table setting data
                            $ADDDATA = "INSERT INTO table_setting (`positionX`, `positionY`, `restaurant_id`) VALUES (?,?,?)";

                            // proceed to update on the account info
                            $stmt = $conn->prepare($ADDDATA);
                            $stmt->bind_param("ssi", $positionX, $positionY, $restaurant_id);
                            $stmt->execute();

                            if (($stmt->error) == false) {
                                // if there is no error occurred, then the account info has been updated. Return true back to Axious
                                $stmt->close();
                        
                                echo true;
                            } else {
                                // if the update failed, something went wrong
                                echo "Table setting data insertion failed. Possible error: ".mysqli_error($conn);
                            }
                        } else {
                            // if the update failed, something went wrong
                            echo "Table size data insertion failed. Possible error: ".mysqli_error($conn);
                        }
                    } else {
                        // if the update failed, something went wrong
                        echo "Table Setting data deletion failed. Possible error: ".mysqli_error($conn);
                    }
                } else {
                    // if the update failed, something went wrong
                    echo "Table Size data deletion failed. Possible error: ".mysqli_error($conn);
                }
            }
        } else {
            // if it doesnt defined yet, then we proceed to insert it into the database
            $ADDDATA = "INSERT INTO table_size (`totalX`, `totalY`, `restaurant_id`) VALUES (?,?,?)";

            // proceed to update on the account info
            $stmt = $conn->prepare($ADDDATA);
            $stmt->bind_param("ssi", $totalX, $totalY, $restaurant_id);
            $stmt->execute();

            if (($stmt->error) == false) {
                // if there is no error occurred, then the account info has been updated. Return true back to Axious
                $stmt->close();

                // then finally we will go add the related table_settings data
                // if its the same size we proceed to insert into the table setting data
                $ADDDATA = "INSERT INTO table_setting (`positionX`, `positionY`, `restaurant_id`) VALUES (?,?,?)";

                // proceed to update on the account info
                $stmt = $conn->prepare($ADDDATA);
                $stmt->bind_param("ssi", $positionX, $positionY, $restaurant_id);
                $stmt->execute();

                if (($stmt->error) == false) {
                    // if there is no error occurred, then the account info has been updated. Return true back to Axious
                    $stmt->close();
            
                    echo true;
                } else {
                    // if the update failed, something went wrong
                    echo "Table setting data insertion failed. Possible error: ".mysqli_error($conn);
                }
            } else {
                // if the update failed, something went wrong
                echo "Table size data insertion failed. Possible error: ".mysqli_error($conn);
            }
        }
    } else {
        // if we cant find the restaurant related to the user, then something must have gone wrong with the user to be able to reach this page
        echo "Restaurant has yet to be created.";
    }
?>