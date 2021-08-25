<?php
    // including the conn.php to establish connection with database
    include "./conn.php";
    // inclduing the core.php to prevent errors related with CORS policy from occurring
    include "./core.php";

    $query = "SELECT * FROM test";

    $result = mysqli_query($conn, $query);
    $json_array = array();

    while($row = mysqli_fetch_assoc($result)) {
        $json_array[] = $row;
    }

    echo json_encode($json_array);
?>