<?php
    // including the conn.php to establish connection with database
    include "./conn.php";
    
    $recText = $_POST["text"];
    $recDesc = $_POST["desc"];

    $query = "INSERT INTO test (texthere, descr) VALUES ('$recText', '$recDesc')";

    if (mysqli_query($conn, $query)) {
        echo "Data inserted";
    } else {
        echo "Error!";
    }
?>