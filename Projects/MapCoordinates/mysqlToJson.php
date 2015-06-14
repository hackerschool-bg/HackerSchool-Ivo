<?php

require_once 'config.php';

// check the connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
echo "Connected successfully "."<br><br>";

$sql = "SELECT id, state, city, address, name FROM Best_Buy_State";
$result = $conn->query($sql);

$dbValuesArray = array(array());
if ($result->num_rows > 0) {
    $tempIterator = 0;
    while($row = $result->fetch_assoc()) {
       $tempArray = array("storeId" => $row["id"],
                           "state" => $row["state"],
                           "city" => $row["city"],
                           "address" => $row["address"],
                           "name" => $row["name"]);
        $dbValuesArray[$tempIterator]=$tempArray;
        $tempIterator++;
    }
} else {
    echo "0 results";
}

// transfer the JSON code into $latestJSON & update the local JSON file
$latestJSON = json_encode($dbValuesArray);
file_put_contents("./latestJSON.json", $latestJSON);

$conn = null;
?>