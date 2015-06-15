<?php

require_once 'db.php';

ini_set("display_errors",1);
ini_set('default_charset', 'utf-8');

// check if a line starts with a specific string
function startsWith($text, $startString) {
    $length = strlen($startString);
    return (substr($text, 0, $length) === $startString);
}

function runSqlFile($location, $connection) {

    // load the file
    $commands = file_get_contents($location);

    // delete all comments
    $lines = explode("\n",$commands);
    $commands = '';
    foreach($lines as $line) {
        $line = trim($line);
        // ignore all SQL comments
        if( $line && !startsWith($line,'--') ) {
            $commands .= $line . "\n";
        }
    }

    // convert the lines to an array of statements
    $commands = explode(";", $commands);

    // run the commands
    $total = $success = 0;
    foreach($commands as $command) {
        if(trim($command)) {
            $command.=';';
            if(mysqli_query($connection,($command))){
                // uncomment to list the commands that were executed successfully
                // echo $command . '<br/><br/>';
                ++$success;
            };
            ++$total;
        }
    }

    // return the number of successful queries and the total number of queries found
    echo $success. " out of " . $total . " commands executed successfully.";

    // return the number of correctly executed commands
    return array(
        "success" => $success,
        "total" => $total
    );
}

?>