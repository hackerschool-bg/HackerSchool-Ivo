---------------   WARNING   ---------------
-- keep comments outside of sql commands --
-------------------------------------------
----  the order of execution matters   ----
-------------------------------------------

CREATE TABLE IF NOT EXISTS Ek_doc( 
   document INTEGER NOT NULL UNIQUE PRIMARY KEY,
   doc_kind VARCHAR(50) NOT NULL,
   doc_name TEXT NOT NULL,
   doc_inst TEXT NOT NULL
) charset=utf8;

CREATE TABLE IF NOT EXISTS Ek_kmet(
   kmetstvo varchar(8) NOT NULL UNIQUE PRIMARY KEY, 
   ekatte CHAR(5) NOT NULL UNIQUE, 
   name varchar(30) NOT NULL
) charset=utf8;

-- duplicate ekatte values; cannot be UNIQUE
CREATE TABLE IF NOT EXISTS Ek_obst(
   obstina CHAR(5) NOT NULL UNIQUE PRIMARY KEY,
   ekatte CHAR(5) NOT NULL,
   name VARCHAR(25) NOT NULL
) charset=utf8;

--raion == ekatte + /\-\d\d/ like in [00357-01]
CREATE TABLE IF NOT EXISTS Ek_raion(
   raion CHAR(8) NOT NULL UNIQUE PRIMARY KEY,
   name VARCHAR(50) NOT NULL
) charset=utf8;

CREATE TABLE IF NOT EXISTS Ek_reg2(
   region CHAR(4) NOT NULL UNIQUE PRIMARY KEY,
   name VARCHAR(50) NOT NULL
) charset=utf8;

CREATE TABLE IF NOT EXISTS Ek_sobr( 
   ekatte CHAR(5) NOT NULL UNIQUE PRIMARY KEY,
   kind INTEGER NOT NULL,
   name VARCHAR(50) NOT NULL,
   area1 VARCHAR(50)
) charset=utf8;

-- UNIQUE or not
CREATE TABLE IF NOT EXISTS Ek_obl(
   oblast CHAR(3) NOT NULL UNIQUE PRIMARY KEY,
   ekatte CHAR(5) NOT NULL UNIQUE,
   name VARCHAR(50) NOT NULL,
   region CHAR(4) NOT NULL,
   FOREIGN KEY(region) REFERENCES Ek_reg2(region)
) charset=utf8;

-- UNIQUE or not
CREATE TABLE IF NOT EXISTS Ek_tsb(
   tsb CHAR(2) NOT NULL UNIQUE PRIMARY KEY,
   name VARCHAR(50) NOT NULL
) charset=utf8;

CREATE TABLE IF NOT EXISTS Sof_rai(
   ekatte CHAR(5) NOT NULL UNIQUE PRIMARY KEY,
   t_v_m VARCHAR(5) NOT NULL,
   name VARCHAR(50) NOT NULL,
   raion CHAR(8) NOT NULL
) charset=utf8;

CREATE TABLE IF NOT EXISTS Ek_atte(
   ekatte CHAR(5) NOT NULL UNIQUE PRIMARY KEY,
   t_v_m VARCHAR(25) NOT NULL,
   name VARCHAR(50)NOT NULL,
   oblast CHAR(3) NOT NULL,
   obstina CHAR(5) NOT NULL,
   kmetstvo CHAR(8) NOT NULL,
   kind INTEGER NOT NULL,
   category INTEGER NOT NULL,
   altitude INTEGER NOT NULL,
   document INTEGER NOT NULL,
   tsb CHAR(2) NOT NULL,
   FOREIGN KEY(oblast) REFERENCES Ek_obl(oblast),
   FOREIGN KEY(obstina) REFERENCES Ek_obst(obstina),
   FOREIGN KEY(kmetstvo) REFERENCES Ek_kmet(kmetstvo),
   FOREIGN KEY(document) REFERENCES Ek_doc(document),
   FOREIGN KEY(tsb) REFERENCES Ek_tsb(tsb)
) charset=utf8;