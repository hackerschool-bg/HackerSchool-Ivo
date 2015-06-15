CREATE INDEX Ek_atte_Name_Index on Ek_atte(name) using HASH;

CREATE INDEX Ek_raion_Name_Index on Ek_raion(name) using HASH;

CREATE INDEX Ek_sobr_Name_Index on Ek_sobr(name) using HASH;

CREATE INDEX Ek_atte_Ekatte_Index on Ek_atte(ekatte) using HASH;

CREATE INDEX Ek_kmet_Ekatte_Index on Ek_kmet(ekatte) using HASH;

CREATE INDEX Ek_kmet_Kmetstvo_Index on Ek_kmet(kmetstvo) using HASH;