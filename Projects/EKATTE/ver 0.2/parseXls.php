<?php
ini_set("display_errors",1);
ini_set('default_charset', 'utf-8');

require_once './excel_reader2.php';
require_once './db.php';

$xlsFiles=array("Ek_doc", "Ek_kmet", "Ek_obst", "Ek_raion", "Ek_reg2", "Ek_sobr", "Ek_obl", "Ek_tsb", "Sof_rai", "Ek_atte");

// 0 .. 10
// go through every filename in $xlsFiles
for($tmp=9;$tmp<10;$tmp++) {
   echo "EKATTE/" . $xlsFiles[$tmp] . ".xls <br/>";

   // open the xls file using the excel_reader2.php library
   $data = new Spreadsheet_Excel_Reader("EKATTE/" . $xlsFiles[$tmp] . ".xls");

   // go through every sheet in the current file
   for($i=0, $totalSheets=count($data->sheets);$i<$totalSheets;$i++) {
      if(count($data->sheets[$i]['cells'])>0) {

         // string of values that is to be inserted into the database
         $sqlQuery='';

         // counts the number of records in  the insert string
         $inputRow=1;

         // add 1 row offset and start reading from the 3rd row if the current file is Ek_atte.xls
         $ekatteOffset=0;
         if($xlsFiles[$tmp]=="Ek_atte"){
            $ekatteOffset=1;
         }

         // go through every row in the current sheet
         for($j=2 + $ekatteOffset, $colLength=count($data->sheets[$i]['cells']); $j<=$colLength; $j++) {
            $dbInput = array();

            // go through every cell in the current row
            for($k=1, $rowLength=count($data->sheets[$i]['cells'][$j]); $k<=$rowLength; $k++) {
               
               // this script works with government documents therefore it has to deal with a ton
               // of formatting errors and inconsistencies; the spaghetti-code below does exactly that

               // skip all cells after the 4th on every row Ek_doc.xls
               if($xlsFiles[$tmp]=="Ek_doc" and $k==5) {
                  $k=10;
                  continue;
               }

               // skip all cells after the 3rd on every row of Ek_kmet.xls
               if($xlsFiles[$tmp]=="Ek_kmet" and $k==4) {
                  $k=10;
                  continue;
               }

               // skip all cells after the 3rd on every row of Ek_obst.xls
               if($xlsFiles[$tmp]=="Ek_obst" and $k==4) {
                  $k=10;
                  continue;
               }

               // skip all cells after the 2nd on every row of Ek_raion.xls
               if($xlsFiles[$tmp]=="Ek_raion" and $k==3) {
                  $k=10;
                  continue;
               }
               
               // skip all cells after the 2nd on every row of Ek_reg2.xls
               if($xlsFiles[$tmp]=="Ek_reg2" and $k==3) {
                  $k=10;
                  continue;
               }
               
               // skip all cells after the 4th on every row of Ek_sobr.xls
               if($xlsFiles[$tmp]=="Ek_sobr" and $k==5) {
                  $k=10;
                  continue;
               }

               // skip all cells after the 4th on every row of Ek_obl.xls
               if($xlsFiles[$tmp]=="Ek_obl" and $k==5) {
                  $k=10;
                  continue;
               }

               // leave Ek_tsb.xls as is without skipping ochanging anything

               // skip all cells after the 4th on every row of Sof_rai.xls
               if($xlsFiles[$tmp]=="Sof_rai" and $k==5) {
                  $k=10;
                  continue;
               }

               // skip the last cell of Ek_atte.xls
               if($xlsFiles[$tmp]=="Ek_atte" and $k==12) {
                  continue;
               }

               // if the cell passed all of the tests above add it to the insertion array
               $dbInput[$k]=$data->sheets[$i]['cells'][$j][$k];
            }      

            // go through every value in the insertion array and prepare it for insertion into the mySql db
            for($inputCell=1, $rowMax=count($dbInput); $inputCell<=$rowMax; $inputCell++) {

               // add an opening parenthesis before the first cell of every row
               if($inputCell == 1) {
                  if($inputRow!=1){
                     $sqlQuery.=',';
                  }
                  $sqlQuery.='(';
               }

               // add row value
               $sqlQuery.="'$dbInput[$inputCell]'";

               // add a comma if this is not the last value for this row
               if($inputCell<$rowMax) {
                  $sqlQuery.=", ";
               }

               // add a closing parenthesis if this is the last value of the row
               if($inputCell == $rowMax) {
                  $sqlQuery.=')';
               }
            } 
            $inputRow++;

            // insert the records in the database when at least 100 are collected OR the file has endeds
            if($inputRow>=100 || $j==$colLength) {
               $sqlQuery.=';';
               $inputRow=1;

               // output the insertion string
               echo 'INSERT INTO '.$xlsFiles[$tmp].' VALUES '. $sqlQuery . "<br/>";
               mysqli_query($connection,('INSERT INTO '.$xlsFiles[$tmp].' VALUES '. $sqlQuery));
               $sqlQuery='';
            }
         }
      }	
   }
   echo 'File EKATTE/'.$xlsFiles[$tmp].".xls successfully parsed and converted to MySQL table ".$xlsFiles[$tmp].".<br>";
}

?>