<?php

// connect to the database if no connection has been established
require_once 'config.php';


// check the connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

echo "Connected successfully!"."<br><br>";

// create the table if it doesn't exist
$sql = "CREATE TABLE IF NOT EXISTS Best_Buy_State (
id INT(8) UNSIGNED NOT NULL PRIMARY KEY, 
address VARCHAR(90) NOT NULL,
city VARCHAR(50) NOT NULL,
name VARCHAR(30) NOT NULL,
lat DOUBLE(12,6) NOT NULL,
lng DOUBLE(12,6) NOT NULL,
state varchar(20) NOT NULL
)";

if ($conn->query($sql) === TRUE) {
    echo "Table created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}

   $conn = null;
?>