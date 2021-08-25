<?php
    // defining the properties of the server
    $serverName = "localhost";
    $username = "root";
    $password = "";
    $databaseName = "estiatorio";

    $conn = mysqli_connect($serverName, $username, $password, $databaseName);

    // Check the server connection
    if(mysqli_connect_error()) {
        echo "Failed to connect to MySQL:".mysqli_connect_error();
        // To prevent header error (it will occur randomly), we will need to use ob_start() and ob_end_flush() function
        ob_start();
        // It will return to homepage automatically (10 seconds later) if SQL error occured, after showing the error message
        header("refresh:5; url=/index.js");
        ob_end_flush();
        exit();
    }
?>