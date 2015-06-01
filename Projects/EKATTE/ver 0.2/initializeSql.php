<?PHP

ini_set("display_errors",1);
ini_set('default_charset', 'utf-8');
require_once 'db.php';

mysqli_query($connection,(" DROP TABLE Ek_doc;" ));
$sqlQuery ="Ek_doc( 
   id INTEGER NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
   document INTEGER NOT NULL UNIQUE,
   doc_kind VARCHAR(50) NOT NULL,
   doc_name TEXT NOT NULL,
   doc_inst TEXT NOT NULL,
   doc_num VARCHAR(50),
   doc_date VARCHAR(10) NOT NULL,
   doc_act VARCHAR(10) NOT NULL
) charset=utf8";
mysqli_query($connection,("CREATE TABLE ".$sqlQuery.";"));

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

mysqli_query($connection,(" DROP TABLE Ek_raion;" ));
$sqlQuery ="Ek_raion( 
   id INTEGER NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
   raion CHAR(8) NOT NULL UNIQUE,
   name VARCHAR(50) NOT NULL,
   category INTEGER,
   document INTEGER NOT NULL REFERENCES Ek_doc(document)
) charset=utf8";
mysqli_query($connection,("CREATE TABLE ".$sqlQuery.";"));

mysqli_query($connection,("DROP TABLE Ek_reg2;" ));
$sqlQuery ="Ek_reg2( 
   id INTEGER NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
   region CHAR(4) NOT NULL UNIQUE,
   name VARCHAR(50) NOT NULL,
   document INTEGER NOT NULL REFERENCES Ek_doc(document)
) charset=utf8";
mysqli_query($connection,("CREATE TABLE ".$sqlQuery.";"));

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

mysqli_query($connection,("DROP TABLE Ek_obl;" ));
$sqlQuery ="Ek_obl( 
   id INTEGER NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
   oblast CHAR(3) NOT NULL UNIQUE,
   ekatte CHAR(5) NOT NULL,
   name VARCHAR(50)NOT NULL,
   region CHAR(4) NOT NULL REFERENCES ek_reg2(region),
   document INTEGER NOT NULL REFERENCES Ek_doc(document)
) charset=utf8";
mysqli_query($connection,("CREATE TABLE ".$sqlQuery.";"));

//Create a new table Ek_sobr
mysqli_query($connection,("DROP TABLE Ek_tsb;" ));
$sqlQuery ="Ek_tsb( 
   id INTEGER NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
   tsb CHAR(2) NOT NULL UNIQUE,
   name VARCHAR(50)NOT NULL
) charset=utf8";
mysqli_query($connection,("CREATE TABLE ".$sqlQuery.";"));

mysqli_query($connection,("DROP TABLE Sof_rai;" ));
$sqlQuery ="Sof_rai( 
   id INTEGER NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
   ekatte CHAR(5) NOT NULL,
   t_v_m VARCHAR(5),
   name VARCHAR(50) NOT NULL,
   raion CHAR(8) NOT NULL REFERENCES ek_raion(raion),
   kind INTEGER NOT NULL,
   document INTEGER NOT NULL REFERENCES Ek_doc(document)
) charset=utf8";
mysqli_query($connection,("CREATE TABLE ".$sqlQuery.";"));

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
   document INTEGER NOT NULL REFERENCES Ek_doc(document),
   tsb CHAR(2) NOT NULL REFERENCES Ek_tsb(tsb)
) charset=utf8";
mysqli_query($connection,("CREATE TABLE ".$sqlQuery.";"));

?>