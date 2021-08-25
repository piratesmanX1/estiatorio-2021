<?php
    // including the conn.php to establish connection with database
    include "./conn.php";
    
    // inclduing the core.php to prevent errors related with CORS policy from occurring
    include "./core.php";

    // fetch all data
    $FETCHDATA = "SELECT 
                  account_log.acclog_id,
                  user.first_name AS 'affected_first_name', 
                  user.last_name AS 'affected_last_name',
                  u.first_name AS 'decider_first_name',
                  u.last_name AS 'decider_last_name',
                  account_log.log_status,
                  account_log.affected_date
                  FROM account_log
                  JOIN user
                  ON account_log.user_id = user.user_id
                  JOIN user u 
                  ON account_log.decider_id = u.user_id
                  ORDER BY account_log.affected_date DESC";
    $FETCHDATAQ = mysqli_query($conn, $FETCHDATA);

    if (mysqli_num_rows($FETCHDATAQ ) < 1) {
        // if there is no data 
        return false;
    } else {
        // if there is data
        // fetching the data into JSON array
        while ($row = mysqli_fetch_array($FETCHDATAQ)) {
            // save into JSON array
            $json_array[] = $row;
        }

        echo json_encode($json_array);
    }
?>