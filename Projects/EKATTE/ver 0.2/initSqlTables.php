<?php
ini_set("display_errors",1);
ini_set('default_charset', 'utf-8');

require_once 'db.php';
require_once 'executeSqlFile.php';

if($connection) {
    echo "Established connection with the database.<br/><br/>";
} else {
    echo "No connection with the database.<br/><br/>";
}

runSqlFile('./initSqlTables.sql', $connection);
?>