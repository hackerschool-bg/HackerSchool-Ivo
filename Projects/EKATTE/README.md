# EKATTE

latest version 0.2

Specifications
===

The aim of the project is to visualize the information collected by [NSI](http://www.nsi.bg/nrnm/) (the webpage is in Bulgarian)  about the settlements in Bulgaria. The information is stored in a zip file that contains several XML files.

The current version of the project deals with:

creating a relational MySQL database in 2nd normal form (explanation provided)

parsing the XLM files and storing the information in a MySQL database

creating a view consisting of the names of all settlements that is later converted to JSON and used for the AJAX input autocomplete

creating a view with some of the information available for the chosen town or village

Goals
====

The goal of the project is to create a wholesome database that contains not only information about all settlements but also the date of modification. This way a person searching for a given town can see exactly when its status was changed from village to town. This is why the tables are in 2nd normal form so that two settlements with the same EKATTE number can coexist (the settlement before it was promoted to a town and after the fact).

TODO
====

Create a script that downloads the archive from NSI, unzips it and cues the XML parser

Modify the MySQL tables so that the date of modification can be stored

Add the remaining 3 tables to the VIEW containing information about each village

Add information for the tourist attractions and neighborhoods that have their own EKATTE number

