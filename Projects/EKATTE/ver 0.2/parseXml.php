<?php
ini_set("display_errors",1);
ini_set('default_charset', 'utf-8');
require_once 'excel_reader2.php';
require_once 'db.php';

$xlsFiles=array("Ek_doc", "Ek_kmet", "Ek_obst", "Ek_raion", "Ek_reg2", "Ek_sobr", "Ek_obl", "Ek_tsb", "Sof_rai", "Ek_atte");

for($tmp=0;$tmp<10;$tmp++) {
   echo "EKATTE/" . $xlsFiles[$tmp] . ".xls";
   $data = new Spreadsheet_Excel_Reader("EKATTE/" . $xlsFiles[$tmp] . ".xls");
   for($i=0;$i<count($data->sheets);$i++) {	
      if(count($data->sheets[$i]['cells'])>0) {
         //echo "Sheet $i:<br /><br />Total rows in sheet $i  ".count($data->sheets[$i]['cells'])."<br />";
         for($j=2;$j<=count($data->sheets[$i]['cells']);$j++) {
            $dbInput = array();
            //echo "<br> The number of column is: ".count($data->sheets[$i]['cells'][$j]) . " ! <br>";
            for($k=1;$k<=count($data->sheets[$i]['cells'][$j]);$k++) {
               
               if($xlsFiles[$tmp]=="Ek_raion" and $k==3) {
                  $dbInput[$k]="";
                  $k++;
               }
               
               if($xlsFiles[$tmp]=="Ek_kmet" and $k==4) {
                  $dbInput[$k]="";
                  $k++;
               }
               
               if($xlsFiles[$tmp]=="Ek_reg2" and $k==4) {
                  continue;
               }
               
               if($xlsFiles[$tmp]=="Ek_sobr" and $k==5) {
                  $dbInput[$k]="";
                  $k++;
               }
               if(($xlsFiles[$tmp]=="Ek_obl" or $xlsFiles[$tmp]=="Ek_obst") and $k==6) {
                  continue;
               }
               
               if($xlsFiles[$tmp]=="Ek_sobr" and $k==7) {
                  continue;
               }
               
               if($xlsFiles[$tmp]=="Ek_doc" and $k==8) {
                  $k=10;
                  continue;
               }
               
               if($xlsFiles[$tmp]=="Ek_atte" and $k==12) {
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
            //echo "insert into " . $xlsFiles[$tmp] . " values(" . $sqlQuery . "); <br>";
            
            mysqli_query($connection,("insert into " . $xlsFiles[$tmp] . " values(" . $sqlQuery . ");"));
         }
      }	
   }
   echo 'File EKATTE/'.$xlsFiles[$tmp].".xls successfully parsed and converted to MySQL table ".$xlsFiles[$tmp].".<br>";
}

?>