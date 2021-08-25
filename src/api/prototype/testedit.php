<?php
    // including the conn.php to establish connection with database
    include "./conn.php";
    
    // inclduing the core.php to prevent errors related with CORS policy from occurring
    include "./core.php";

    $recText = $_POST["text"];
    $recDesc = $_POST["desc"];

    $query = "DELETE FROM test WHERE id = 1";

    $queryq = mysqli_query($conn, $query);

    if (mysqli_affected_rows($conn) < 1) {
        echo "Error!";
    } else {
        echo "Data deleted";
    }
?>