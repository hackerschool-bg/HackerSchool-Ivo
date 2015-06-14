<?php

// connect to the database if no connection has been established
require_once 'config.php';

$requestURL = "https://api.remix.bestbuy.com/v1/stores?apiKey=";
$requestURL .= $apiKey;
// add page number and format
$requestURL .= "&show=address,city,hours,lat,lng,name,region,storeId&pageSize=100&page=";



// check the connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
echo "Connected successfully "."<br><br>";

// initial request to the API
$requestJson = $requestURL . "1&format=json";
$jsonData = file_get_contents($requestJson);
$data = json_decode($jsonData, true);

$insertAddress = "";
$insertCity = "";
$insertName = "";
$insertLat = "";
$insertLng = "";
$insertStoreId = "";
$insertState = "";

// initial query
$sql = "INSERT INTO Best_Buy_State (id, address, state, city, name, lat, lng) VALUES ($dbStoreId, \"$dbAddress\", \"$dbState\" ,\"$dbCity\", \"$dbName\", $dbLat, $dbLng)";

// process every page of the API
for($page = 1, $lastPage = $data["totalPages"]; $page <= $lastPage; $page++){
    // add page number to the API
    $requestJson = $requestURL . $page . "&format=json";

    // convert the JSON to php array
    $jsonData = file_get_contents($requestJson);
    $data = json_decode($jsonData, true);

    // initialize query
    $sql = "INSERT INTO Best_Buy_State (id, address, state, city, name, lat, lng) VALUES ";
    $rowNum=1;

    // process every row from the API
    foreach ($data["stores"] as $key => $value) {

        // format the multiline mysql insert
        if($rowNum>1){
            $sql .= ",";
        }
        $rowNum++;

        foreach ($value as $k => $v) {
            switch ($k){
                case "address":
                $dbAddress=$v;
                break;

                case "city":
                $dbCity = $v;
                break;
          
                case "name":
                $dbName = $v;
                break;
          
                case "lat":
                $dbLat = $v;
                break;
          
                case "lng": 
                $dbLng = $v;
                break;
          
                case "storeId":
                $dbStoreId=$v;
                break;
          
                case "region":
                $dbState=$v;
                break;
            }
        }

        // concatinate current row to the sql inser statement
        $sql .= "($dbStoreId, \"$dbAddress\", \"$dbState\" ,\"$dbCity\", \"$dbName\", $dbLat, $dbLng)";
        
        

    }

    if (mysqli_query($conn, $sql)) {
        // add all 100 lines to the database
        $last_id = mysqli_insert_id($conn);
    } else {
        // output the error message to the page
        echo "Error: " . $sql . "<br>" . mysqli_error($conn) . "<br><br>";
    }

    echo "Processing page: " . $page . "<br/>";
}

$conn = null;
?>
 
