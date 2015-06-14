<?php
$servername = "localhost";
$username = "root";
$password = "letmein";
$dbname = "Parsed_JSON";
$apiKey="fmk5m3vspagctp5q3bp3m867";
$requestURL = "https://api.remix.bestbuy.com/v1/stores?apiKey=fmk5m3vspagctp5q3bp3m867&show=address,city,hours,lat,lng,name,region,storeId&pageSize=100&page=6&format=json";

// create a connection to the database
$conn = mysqli_connect($servername, $username, $password, $dbname);

// check the connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
echo "Connected successfully "."<br><br>";

/*
// Create table
$sql = "CREATE TABLE Best_Buy_State (
id INT(8) UNSIGNED PRIMARY KEY, 
address VARCHAR(90) NOT NULL,
city VARCHAR(50) NOT NULL,
name VARCHAR(30) NOT NULL,
lat DOUBLE(12,6) NOT NULL,
lng DOUBLE(12,6) NOT NULL,
state varchar(20) NOT NULL
)";

/*
if ($conn->query($sql) === TRUE) {
    echo "Table created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}
*/
// End of table creation

$sql = "SELECT id, state, city, address, name FROM Best_Buy_State";
$result = $conn->query($sql);

$dbValuesArray = array(array());
if ($result->num_rows > 0) {
    // output data of each row
//      echo "\"stores\": [<br>";
   $tempIterator = 0;
    while($row = $result->fetch_assoc()) {
 //      echo "{<br>"."\"storeId\": " . $row["id"]. ",<br>". "\"address\": \"" .$row["address"]."\",<br>". "\"city\": \"" . $row["city"]. "\",<br>"."\"name\": \"" . $row["name"]. "\" <br>},<br>";
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

//transfer the JSON code into $latestJSON & update the local JSON file that will be used by the JavaScript function
$latestJSON = json_encode($dbValuesArray);
file_put_contents("latestJSON2.json", $latestJSON);
//   echo "]<br>";

//$jsondata = file_get_contents('stores.json');
$jsondata = file_get_contents($requestURL);
//echo $jsondata->from;
$data = json_decode($jsondata, true);
//echo $data;

$dbAddress = "";
$dbCity = "";
$dbName = "";
$dbLat = "";
$dbLng = "";
$dbStoreId = "";
$dbState = "";

//print_r($data);
foreach ($data["stores"] as $key => $value) { 
   //echo "<p>$key</p>";
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
      // echo "$k | $v <br />";
    }
//echo $dbCity ." " . $dbAddress . " " . $dbName . " " . $dbLat . " " . $dbLng . "<br>";   
 
   
   $sql = "INSERT INTO Best_Buy_State (id, address, state, city, name, lat, lng)
VALUES ($dbStoreId, \"$dbAddress\", \"$dbState\" ,\"$dbCity\", \"$dbName\", $dbLat, $dbLng)";
// Add the other statements using .= to cat them to the previous ones.

   if (mysqli_query($conn, $sql)) {
      $last_id = mysqli_insert_id($conn);
   } else {
      echo "Error: " . $sql . "<br>" . mysqli_error($conn) . "<br><br>";
   }   
}

//______ALL RECORDS ARE ENTERED________
   $conn = null;
?>
 
