<?php
ini_set("display_errors",1);
require_once 'excel_reader2.php';
require_once 'db.php';

ini_set('default_charset', 'utf-8');



//parse Ek_doc.xls and save it into the database
$data = new Spreadsheet_Excel_Reader("EKATTE/Ek_doc.xls");
//Create a new table Ek_kmet
mysqli_query($connection,(" DROP TABLE Ek_doc;" ));
$sqlQuery ="Ek_doc( 
   id INTEGER NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
   document INTEGER NOT NULL UNIQUE,
   doc_kind VARCHAR(50) NOT NULL,
   doc_name TEXT NOT NULL,
   doc_inst TEXT NOT NULL,
   doc_num VARCHAR(50),
   doc_date VARCHAR(10) NOT NULL
) charset=utf8";
mysqli_query($connection,("CREATE TABLE ".$sqlQuery.";"));

for($i=0;$i<count($data->sheets);$i++) {	
	if(count($data->sheets[$i]['cells'])>0) {
		//echo "Sheet $i:<br /><br />Total rows in sheet $i  ".count($data->sheets[$i]['cells'])."<br />";
		for($j=2;$j<=count($data->sheets[$i]['cells']);$j++) { 
            $dbInput = array();
            //echo "<br> The number of column is: ".count($data->sheets[$i]['cells'][$j]) . " ! <br>";
			for($k=1;$k<=count($data->sheets[$i]['cells'][$j]);$k++) {
               
               
               if($k == 7){
                  $k=9;
               }else{
                  $dbInput[$k]=$data->sheets[$i]['cells'][$j][$k];
               }
               
			}
//fills the position of the AUTO_INCREMENT id          
            $sqlQuery="'id', ";
           
            for($dbi=1;$dbi<=count($dbInput);$dbi++){
                $sqlQuery.="'$dbInput[$dbi]'";
                if($dbi<(count($dbInput))){
                   $sqlQuery.=", ";
                }
            } 
           
           
           if(!mysqli_query($connection,("insert into Ek_doc values(" . $sqlQuery . ");" ))){
              echo "insert into Ek_doc values(" . $sqlQuery . "); <br>";
               echo "Failed! <br> <br>";
           }
		}
	}	
}//end of Ek_doc.xls conversion


//parse Ek_kmet.xls and save it into the database
$data = new Spreadsheet_Excel_Reader("EKATTE/Ek_kmet.xls");
//Create a new table Ek_kmet
mysqli_query($connection,(" DROP TABLE Ek_kmet;" ));
$sqlQuery ="Ek_kmet( 
   id INTEGER NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
   kmetstvo varchar(8) NOT NULL UNIQUE, 
   ekatte CHAR(5) NOT NULL UNIQUE, 
   name varchar(30) NOT NULL, 
   category varchar(10), 
   document INTEGER NOT NULL REFERENCES Ek_doc(document)
) charset=utf8;";
mysqli_query($connection,("CREATE TABLE ".$sqlQuery));

for($i=0;$i<count($data->sheets);$i++) {	
	if(count($data->sheets[$i]['cells'])>0) {
		//echo "Sheet $i:<br /><br />Total rows in sheet $i  ".count($data->sheets[$i]['cells'])."<br />";
		for($j=2;$j<=count($data->sheets[$i]['cells']);$j++) { 
            $dbInput = array();
            //echo "<br> The number of column is: ".count($data->sheets[$i]['cells'][$j]) . " ! <br>";
			for($k=1;$k<=count($data->sheets[$i]['cells'][$j]);$k++) {
               
//excel_reader2.php stops parsing the row if it encounter an empty cell. This is a workaround.
               if($k==4){
                  $dbInput[$k]=$data->sheets[$i]['cells'][$j][$k];
                  $k++;
               }
               
                  $dbInput[$k]=$data->sheets[$i]['cells'][$j][$k];
               
               if($k % 5 ==0){
                  $sqlQuery = "";
                  $sqlQuery.='"id", "'.$dbInput[($k-4)].'", "'.$dbInput[($k-3)].'", "'.$dbInput[($k-2)].'", "'. $dbInput[($k-1)].'", "'.$dbInput[($k)].'"';
                  echo $sqlQuery;
                  mysqli_query($connection,("insert into Ek_kmet values(" . $sqlQuery . ");" ));
               }
            
			}
		}
	}	
}//end of Ek_kmet.xls conversion


//parse Ek_obst.xls and save it into the database
$data = new Spreadsheet_Excel_Reader("EKATTE/Ek_obst.xls");
//Create a new table Ek_kmet
mysqli_query($connection,(" DROP TABLE Ek_obst;" ));
$sqlQuery ="Ek_obst( 
   id INTEGER NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
   obstina CHAR(5) NOT NULL UNIQUE,
   ekatte CHAR(5) NOT NULL,
   name VARCHAR(25) NOT NULL,
   category INTEGER NOT NULL,
   document INTEGER NOT NULL
) charset=utf8";
mysqli_query($connection,("CREATE TABLE ".$sqlQuery.";"));

for($i=0;$i<count($data->sheets);$i++) {	
	if(count($data->sheets[$i]['cells'])>0) {
		//echo "Sheet $i:<br /><br />Total rows in sheet $i  ".count($data->sheets[$i]['cells'])."<br />";
		for($j=2;$j<=count($data->sheets[$i]['cells']);$j++) { 
            $dbInput = array();
            //echo "<br> The number of column is: ".count($data->sheets[$i]['cells'][$j]) . " ! <br>";
			for($k=1;$k<=count($data->sheets[$i]['cells'][$j]);$k++) {
                  if($k==6){
                     continue;
                  }
                  $dbInput[$k]=$data->sheets[$i]['cells'][$j][$k];
			}
//fills the position of the AUTO_INCREMENT id          
            $sqlQuery="'id', ";
           
            for($dbi=1;$dbi<=count($dbInput);$dbi++){
                $sqlQuery.="'$dbInput[$dbi]'";
                if($dbi<(count($dbInput))){
                   $sqlQuery.=", ";
                }
            } 
           echo "insert into Ek_obst values(" . $sqlQuery . "); <br>";
           
           mysqli_query($connection,("insert into Ek_obst values(" . $sqlQuery . ");"));
		}
	}	
}//end of Ek_obst.xls conversion




//parse Ek_obst.xls and save it into the database
$data = new Spreadsheet_Excel_Reader("EKATTE/Ek_raion.xls");
//Create a new table Ek_kmet
mysqli_query($connection,(" DROP TABLE Ek_raion;" ));
$sqlQuery ="Ek_raion( 
   id INTEGER NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
   raion CHAR(8) NOT NULL UNIQUE,
   name VARCHAR(50) NOT NULL,
   category INTEGER,
   document INTEGER NOT NULL REFERENCES Ek_doc(document)
) charset=utf8";
mysqli_query($connection,("CREATE TABLE ".$sqlQuery.";"));

for($i=0;$i<count($data->sheets);$i++) {	
	if(count($data->sheets[$i]['cells'])>0) {
		//echo "Sheet $i:<br /><br />Total rows in sheet $i  ".count($data->sheets[$i]['cells'])."<br />";
		for($j=2;$j<=count($data->sheets[$i]['cells']);$j++) { 
            $dbInput = array();
            //echo "<br> The number of column is: ".count($data->sheets[$i]['cells'][$j]) . " ! <br>";
			for($k=1;$k<=count($data->sheets[$i]['cells'][$j]);$k++) {
                  if($k==3){
                     $dbInput[$k]=$data->sheets[$i]['cells'][$j][$k];
                     $k++;
                  }
                  $dbInput[$k]=$data->sheets[$i]['cells'][$j][$k];
			}
//fills the position of the AUTO_INCREMENT id          
            $sqlQuery="\"id\", ";
           
            for($dbi=1;$dbi<=count($dbInput);$dbi++){
                $sqlQuery.="\"$dbInput[$dbi]\"";
                if($dbi<(count($dbInput))){
                   $sqlQuery.=", ";
                }
            } 
           echo "insert into Ek_raion values(" . $sqlQuery . "); <br>";
           
           mysqli_query($connection,("insert into Ek_raion values(" . $sqlQuery . ");"));
		}
	}	
}//end of Ek_obst.xls conversion


//parse Ek_reg2.xls and save them into the database
$data = new Spreadsheet_Excel_Reader("EKATTE/Ek_reg2.xls");
//Create a new table Ek_region
mysqli_query($connection,("DROP TABLE Ek_region;" ));
$sqlQuery ="Ek_region( 
   id INTEGER NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
   region CHAR(4) NOT NULL UNIQUE,
   name VARCHAR(50) NOT NULL,
   document INTEGER NOT NULL REFERENCES Ek_doc(document)
) charset=utf8";
mysqli_query($connection,("CREATE TABLE ".$sqlQuery.";"));

for($tmp = 0; $tmp<2; $tmp++){
for($i=0;$i<count($data->sheets);$i++) {	
   if(count($data->sheets[$i]['cells'])>0) {
      //echo "Sheet $i:<br /><br />Total rows in sheet $i  ".count($data->sheets[$i]['cells'])."<br />";
      for($j=2;$j<=count($data->sheets[$i]['cells']);$j++) { 
         $dbInput = array();
         //echo "<br> The number of column is: ".count($data->sheets[$i]['cells'][$j]) . " ! <br>";
         for($k=1;$k<=count($data->sheets[$i]['cells'][$j]);$k++) {
            if($k==4){
                  continue;
            }
            
            $dbInput[$k]=$data->sheets[$i]['cells'][$j][$k];
         }
         //fills the position of the AUTO_INCREMENT id          
         $sqlQuery="'id',";
         
         for($dbi=1;$dbi<=count($dbInput);$dbi++){
            $sqlQuery.="'$dbInput[$dbi]'";
            if($dbi<(count($dbInput))){
               $sqlQuery.=", ";
            }
         } 
         echo "insert into Ek_region values(" . $sqlQuery . "); <br>";
         
         mysqli_query($connection,("insert into Ek_region values(" . $sqlQuery . ");"));
      }
   }	
}
   $data = new Spreadsheet_Excel_Reader("EKATTE/Ek_reg1.xls");
}
//end of Ek_region.xls conversion


//parse Ek_sobr.xls and save them into the database
$data = new Spreadsheet_Excel_Reader("EKATTE/Ek_sobr.xls");
//Create a new table Ek_sobr
mysqli_query($connection,("DROP TABLE Ek_sobr;" ));
$sqlQuery ="Ek_sobr( 
   id INTEGER NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
   ekatte CHAR(5) UNIQUE NOT NULL,
   kind INTEGER NOT NULL,
   name VARCHAR(50) NOT NULL,
   area1 VARCHAR(50),
   area2 VARCHAR(10),
   document INTEGER NOT NULL REFERENCES Ek_doc(document)
) charset=utf8";
mysqli_query($connection,("CREATE TABLE ".$sqlQuery.";"));


for($i=0;$i<count($data->sheets);$i++) {	
   if(count($data->sheets[$i]['cells'])>0) {
      //echo "Sheet $i:<br /><br />Total rows in sheet $i  ".count($data->sheets[$i]['cells'])."<br />";
      for($j=2;$j<=count($data->sheets[$i]['cells']);$j++) { 
         $dbInput = array();
         //echo "<br> The number of column is: ".count($data->sheets[$i]['cells'][$j]) . " ! <br>";
         for($k=1;$k<=count($data->sheets[$i]['cells'][$j]);$k++) {
            if($k==7){
                  continue;
            }
            
            if($k==5){
                  $dbInput[$k]="";
                  $k++;
            }
            
            $dbInput[$k]=$data->sheets[$i]['cells'][$j][$k];
         }
         //fills the position of the AUTO_INCREMENT id          
         $sqlQuery="'id', ";
         
         for($dbi=1;$dbi<=count($dbInput);$dbi++){
            $sqlQuery.="'$dbInput[$dbi]'";
            if($dbi<(count($dbInput))){
               $sqlQuery.=", ";
            }
         } 
         echo "insert into Ek_sobr values(" . $sqlQuery . "); <br>";
         
         mysqli_query($connection,("insert into Ek_sobr values(" . $sqlQuery . ");"));
      }
   }	
}
//end of Ek_region.xls conversion



//parse Ek_sobr.xls and save them into the database
$data = new Spreadsheet_Excel_Reader("EKATTE/Ek_obl.xls");
//Create a new table Ek_sobr
mysqli_query($connection,("DROP TABLE Ek_obl;" ));
$sqlQuery ="Ek_obl( 
   id INTEGER NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
   oblast CHAR(3) NOT NULL UNIQUE,
   ekatte CHAR(5) NOT NULL,
   name VARCHAR(50)NOT NULL,
   region CHAR(4) NOT NULL REFERENCES ek_region(region),
   document INTEGER NOT NULL REFERENCES ek_document(document)
) charset=utf8";
mysqli_query($connection,("CREATE TABLE ".$sqlQuery.";"));


for($i=0;$i<count($data->sheets);$i++) {	
   if(count($data->sheets[$i]['cells'])>0) {
      //echo "Sheet $i:<br /><br />Total rows in sheet $i  ".count($data->sheets[$i]['cells'])."<br />";
      for($j=2;$j<=count($data->sheets[$i]['cells']);$j++) { 
         $dbInput = array();
         //echo "<br> The number of column is: ".count($data->sheets[$i]['cells'][$j]) . " ! <br>";
         for($k=1;$k<=count($data->sheets[$i]['cells'][$j]);$k++) {
            if($k==6){
                  continue;
            }
            
            $dbInput[$k]=$data->sheets[$i]['cells'][$j][$k];
         }
         //fills the position of the AUTO_INCREMENT id          
         $sqlQuery="'id', ";
         
         for($dbi=1;$dbi<=count($dbInput);$dbi++){
            $sqlQuery.="'$dbInput[$dbi]'";
            if($dbi<(count($dbInput))){
               $sqlQuery.=", ";
            }
         } 
         echo "insert into Ek_obl values(" . $sqlQuery . "); <br>";
         
         mysqli_query($connection,("insert into Ek_obl values(" . $sqlQuery . ");"));
      }
   }	
}


//parse Ek_sobr.xls and save them into the database
$data = new Spreadsheet_Excel_Reader("EKATTE/Ek_tsb.xls");
//Create a new table Ek_sobr
mysqli_query($connection,("DROP TABLE Ek_tsb;" ));
$sqlQuery ="Ek_tsb( 
   id INTEGER NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
   tsb CHAR(2) NOT NULL UNIQUE,
   name VARCHAR(50)NOT NULL
) charset=utf8";
mysqli_query($connection,("CREATE TABLE ".$sqlQuery.";"));


for($i=0;$i<count($data->sheets);$i++) {	
   if(count($data->sheets[$i]['cells'])>0) {
      //echo "Sheet $i:<br /><br />Total rows in sheet $i  ".count($data->sheets[$i]['cells'])."<br />";
      for($j=2;$j<=count($data->sheets[$i]['cells']);$j++) { 
         $dbInput = array();
         //echo "<br> The number of column is: ".count($data->sheets[$i]['cells'][$j]) . " ! <br>";
         for($k=1;$k<=count($data->sheets[$i]['cells'][$j]);$k++) {
                       
            $dbInput[$k]=$data->sheets[$i]['cells'][$j][$k];
         }
         //fills the position of the AUTO_INCREMENT id          
         $sqlQuery="'id', ";
         
         for($dbi=1;$dbi<=count($dbInput);$dbi++){
            $sqlQuery.="'$dbInput[$dbi]'";
            if($dbi<(count($dbInput))){
               $sqlQuery.=", ";
            }
         } 
         echo "insert into Ek_tsb values(" . $sqlQuery . "); <br>";
         
         mysqli_query($connection,("insert into Ek_tsb values(" . $sqlQuery . ");"));
      }
   }	
}


//parse Ek_sobr.xls and save them into the database
$data = new Spreadsheet_Excel_Reader("EKATTE/Sof_rai.xls");
//Create a new table Ek_sobr
mysqli_query($connection,("DROP TABLE Sof_rai;" ));
$sqlQuery ="Sof_rai( 
   id INTEGER NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
   ekatte CHAR(5) NOT NULL,
   t_v_m VARCHAR(5),
   name VARCHAR(50) NOT NULL,
   raion CHAR(8) NOT NULL REFERENCES ek_raion(raion),
   kind INTEGER NOT NULL,
   document INTEGER NOT NULL REFERENCES ek_document(document)
) charset=utf8";
mysqli_query($connection,("CREATE TABLE ".$sqlQuery.";"));


for($i=0;$i<count($data->sheets);$i++) {	
   if(count($data->sheets[$i]['cells'])>0) {
      //echo "Sheet $i:<br /><br />Total rows in sheet $i  ".count($data->sheets[$i]['cells'])."<br />";
      for($j=2;$j<=count($data->sheets[$i]['cells']);$j++) { 
         $dbInput = array();
         //echo "<br> The number of column is: ".count($data->sheets[$i]['cells'][$j]) . " ! <br>";
         for($k=1;$k<=count($data->sheets[$i]['cells'][$j]);$k++) {
                       
            $dbInput[$k]=$data->sheets[$i]['cells'][$j][$k];
         }
         //fills the position of the AUTO_INCREMENT id          
         $sqlQuery="'id', ";
         
         for($dbi=1;$dbi<=count($dbInput);$dbi++){
            $sqlQuery.="'$dbInput[$dbi]'";
            if($dbi<(count($dbInput))){
               $sqlQuery.=", ";
            }
         } 
         echo "insert into Sof_rai values(" . $sqlQuery . "); <br>";
         
         mysqli_query($connection,("insert into Sof_rai values(" . $sqlQuery . ");"));
      }
   }	
}


//parse Ek_sobr.xls and save them into the database
$data = new Spreadsheet_Excel_Reader("EKATTE/Ek_atte.xls");
//Create a new table Ek_sobr
mysqli_query($connection,("DROP TABLE Ek_atte;" ));
$sqlQuery ="Ek_atte( 
   id INTEGER NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
   ekatte CHAR(5) NOT NULL,
   t_v_m VARCHAR(25),
   name VARCHAR(50)NOT NULL,
   area CHAR(3) NOT NULL REFERENCES ek_area(area),
   municipality CHAR(5) NOT NULL REFERENCES Ek_obl(oblast),
   town_hall CHAR(8) NOT NULL REFERENCES Ek_kmet(kmetstvo),
   kind INTEGER NOT NULL,
   category INTEGER NOT NULL,
   altitude INTEGER NOT NULL,
   document INTEGER NOT NULL REFERENCES Ek_document(document),
   tsb CHAR(2) NOT NULL REFERENCES Ek_tsb(tsb)
) charset=utf8";
mysqli_query($connection,("CREATE TABLE ".$sqlQuery.";"));


for($i=0;$i<count($data->sheets);$i++) {	
   if(count($data->sheets[$i]['cells'])>0) {
      //echo "Sheet $i:<br /><br />Total rows in sheet $i  ".count($data->sheets[$i]['cells'])."<br />";
      for($j=3;$j<=count($data->sheets[$i]['cells']);$j++) { 
         $dbInput = array();
         //echo "<br> The number of column is: ".count($data->sheets[$i]['cells'][$j]) . " ! <br>";
         for($k=1;$k<=count($data->sheets[$i]['cells'][$j]);$k++) {
            if($k==12){
               continue;
            }
            $dbInput[$k]=$data->sheets[$i]['cells'][$j][$k];
         }
         //fills the position of the AUTO_INCREMENT id          
         $sqlQuery="'id', ";
         
         for($dbi=1;$dbi<=count($dbInput);$dbi++){
            $sqlQuery.="'$dbInput[$dbi]'";
            if($dbi<(count($dbInput))){
               $sqlQuery.=", ";
            }
         } 
         echo "insert into Ek_atte values(" . $sqlQuery . "); <br>";
         
         mysqli_query($connection,("insert into Ek_atte values(" . $sqlQuery . ");"));
      }
   }	
}

?>