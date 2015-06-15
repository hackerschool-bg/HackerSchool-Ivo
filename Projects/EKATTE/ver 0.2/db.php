<?php

define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'root');
define('DB_PASSWORD', 'letmein');
define('DB_DATABASE', 'excel2');
define('DB_DRIVER', "mysql");
$connection = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
$connection->set_charset("utf8");

?>