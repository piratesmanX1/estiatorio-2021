<?php
    // including the conn.php to establish connection with database
    include "./conn.php";
    
    // inclduing the core.php to prevent errors related with CORS policy from occurring
    include "./core.php";

    $reservation_time = mysqli_real_escape_string($conn, $_POST["reservation_time"]);
    $table_number = mysqli_real_escape_string($conn, $_POST["table_number"]);
    $restaurant_id = mysqli_real_escape_string($conn, $_POST["restaurant_id"]);
    $user_id = mysqli_real_escape_string($conn, $_POST["user_id"]);
    
    $reservation_date = date("Y-m-d", strtotime($reservation_time));

    // first we need to get the existing reservation of the day and compare it with the user's reservation
    // to find out how many user occupied the slot with the default 2 hours reservation duration expectation
    $FETCHDATA = "SELECT * FROM reservation_log WHERE `restaurant_id` = $restaurant_id AND `status` = 1 OR `status` = 0 AND `reservation_time` BETWEEN '$reservation_date 00:00:00' AND '$reservation_date 23:59:59'";
    $FETCHDATAQ = mysqli_query($conn, $FETCHDATA);

    $RESTAURANTSEAT = "SELECT `seat_capacity` FROM restaurant WHERE `restaurant_id` = $restaurant_id";
    $RESTAURANTSEATQ = mysqli_query($conn, $RESTAURANTSEAT);

    // insert the reservation
    $ADDDATA = "INSERT INTO reservation_log (`reservation_time`, `table_number`, `status`, `restaurant_id`, `user_id`) VALUES (?,?,?,?,?)";

    // we first take in the number of seating set by the restaurant
    if (mysqli_num_rows($RESTAURANTSEATQ) < 1) {
        // if we can't find the data then something must have gone wrong
        echo "Restaurant seating number unable to be fetched, please try again.";
    } else {
        while ($row = mysqli_fetch_array($RESTAURANTSEATQ)) {
            $seat_capacity = $row["seat_capacity"];
        }
        if (mysqli_num_rows($FETCHDATAQ ) < 1) {
            // if there is no data, means nobody created the reservation for the day yet
            // proceed to make reservation without cautious
            if ($seat_capacity >= $table_number) {
                $stmt = $conn->prepare($ADDDATA);
                $status = 1;
                $stmt->bind_param("sssii", $reservation_time, $table_number, $status, $restaurant_id, $user_id);
                $stmt->execute();
                
                if (($stmt->error) == false) {
                    // if there is no error occurred, then the account info has been updated. Return true back to Axious
                    $stmt->close();
    
                    echo true;
                } else {
                    // if the update failed, something went wrong
                    echo "Reservation insertion failed. Possible error: ".mysqli_error($conn);
                }
            } else {
                echo "Reservation seating is insufficient for your intended reservation capacity, please change the number of your reservation seat and try again.";
            }
        } else {
            // if there is data, we need to take each date and compare it to prevent clash of timing between reservation
    
            // comparison method:
            // - get all the reservation timing from database
            // - then we add the reserved time by 2 hours by default
            // - compare both the added hour and original time with the intended reserved time
            // - if the start time OR end time is larger/equal with the starting time of reservation, the number of seating is considered occupied in the restaurant at the time
            // - then we add the total occupied seat together and see we still have the quantity to reserve or not
            $occupied_seats = 0;
            $reservation_endtime = date('Y-m-d H:i:s',strtotime('+2 hours',strtotime($reservation_time)));
            $r1 = new DateTime($reservation_time);
            $r2 = new DateTime($reservation_endtime);
            while ($row = mysqli_fetch_array($FETCHDATAQ)) {
                $starttime = $row["reservation_time"];
                $endtime = date('Y-m-d H:i:s',strtotime('+2 hours',strtotime($starttime)));
    
                $d1 = new DateTime($starttime);
                $d2 = new DateTime($endtime);
    
                // (if starting time is the same as reserved time) || (if the starting time is smaller than the added reserved time && larger than the reserved time) || (if the endtime is larger than the reserved time && smaller than the added reserve time) 
                if (($d1 == $r1) || (($d1 < $r2) && ($d1 > $r1)) || (($d2 > $r1) && ($d2 < $r2))) {
                    // get the number of seat reserved and add into the variable
                    $occupied_seats = $occupied_seats + $row["table_number"];
                }
            }
            if ($occupied_seats == 0) {
                // if there are no occupied seats yet proceed with the insertion by first checking the available reservation seats
                if ($seat_capacity >= $table_number) {
                    $stmt = $conn->prepare($ADDDATA);
                    $status = 1;
                    $stmt->bind_param("sssii", $reservation_time, $table_number, $status, $restaurant_id, $user_id);
                    $stmt->execute();
                    
                    if (($stmt->error) == false) {
                        // if there is no error occurred, then the account info has been updated. Return true back to Axious
                        $stmt->close();
            
                        echo true;
                    } else {
                        // if the update failed, something went wrong
                        echo "Reservation insertion failed. Possible error: ".mysqli_error($conn);
                    }
                } else {
                    echo "Reservation seating is insufficient for your intended reservation capacity, please change the number of your reservation seat and try again.";
                }
            } else {
                if ($occupied_seats == $seat_capacity) {
                    // if the restaurant seating is already full then reject the reservation of the time
                    echo "Restaurant seat is fully occupied at the intended reserved time, please choose another time by 2 hours differences.";
                } else {
                    // if the occupied seat is not yet full, substract them both and see it is sufficient for the user to reserve the restaurant or not
                    $remaining_seats = $seat_capacity - $occupied_seats;
    
                    if ($remaining_seats >= $table_number) {
                        // if the seats are enough, then proceed to do the reservation
                        $stmt = $conn->prepare($ADDDATA);
                        $status = 1;
                        $stmt->bind_param("sssii", $reservation_time, $table_number, $status, $restaurant_id, $user_id);
                        $stmt->execute();
                        
                        if (($stmt->error) == false) {
                            // if there is no error occurred, then the account info has been updated. Return true back to Axious
                            $stmt->close();
    
                            echo true;
                        } else {
                            // if the update failed, something went wrong
                            echo "Reservation insertion failed. Possible error: ".mysqli_error($conn);
                        }
                    } else {
                        if ($remaining_seats <= 0) {
                            echo "Reservation seating is insufficient for your intended reservation capacity, please change the number of your reservation seat and try again.";
                        } else {
                            // if the seats area not enough, then alert the user on the remaining seating of the time
                            echo "Restaurant seating is not enough for your intended occuppance, the remaining seats are left with total number of " . $remaining_seats;
                        }
                    }
                }
            }
        }
    }
?>