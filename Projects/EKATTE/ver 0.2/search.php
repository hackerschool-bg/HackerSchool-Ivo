<?php
require_once 'db.php';
ini_set('default_charset', 'utf-8');

if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
} 

function raw_json_encode($input) {

    return preg_replace_callback(
        '/\\\\u([0-9a-zA-Z]{4})/',
        function ($matches) {
            return mb_convert_encoding(pack('H*',$matches[1]),'UTF-8','UTF-16');
        },
        json_encode($input)
    );

}


$keyword = $_GET['keyword'];
//$keyword="Ново Село";
$sql = 'SELECT * FROM view_info WHERE name = "'.$keyword.'" limit 20;';
$result = $connection->query($sql);


//{"id":"3277","ekatte":"52177","t_v_m":"с.","name":"Ново село","area":"VTR","municipality":"VTR04","town_hall":"VTR04-23","kind":"3","category":"6","altitude":"5","document":"1873","tsb":"04"};

echo "[";
if ($result->num_rows > 0) {
    // output data of each row
   $counter = $result->num_rows - 1;
    while($row = $result->fetch_assoc()) {
      echo '{ "t_v_m":"' . $row['t_v_m'] . '", "name":"' . $row['name'] . '", "oblast":"' . $row['oblast'] . '", "region":"' . $row['region']  . '", "altitude":"' . $row['altitude'] .'"}';
       if ($counter){
         echo ",";
         $counter--;
       }
    }
} else {
    echo "0 results";
}
echo "]";

$connection->close();
?>