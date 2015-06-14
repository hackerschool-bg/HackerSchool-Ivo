<?php
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'root');

// safety first
define('DB_PASSWORD', 'letmein');
define('DB_DATABASE', 'Parsed_JSON');
define('DB_DRIVER', "mysql");
$conn = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
$conn->set_charset("utf8");

$apiKey="fmk5m3vspagctp5q3bp3m867";
?>