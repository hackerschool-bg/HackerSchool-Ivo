# Node HTTP server using TCP

**The aim of the project is to create an HTTP webserver on top of an already built TCP server using the standard headers and status codes specified in the HTTP protocol.**

---------------

##Features
* Modifiable server address and port via config.js
* Modifiable public directory. Requests for files and directories that are not part of the public directory will not be handled.
* Index search: every requested directory is scanned for default landing page/es that is specified in config.js
* Directory listing: in case a landing page is not found the server generates an HTML table with every subdirectory and file. Config.js offers options for modifying whether subdirectories, hidden files or files wist specific extension are shown.

---------------
##Tests
The public directory contains several subdirectories and files including: 
* files with extensions not present in the allowed extensions in the configuration file, 
* hidden files, 
* several directories including a few empty ones 
* a simple landing page (index.html) which sends a GET request to either sum.html or multiplication.html

---------------
## TODO
* Add support for files with unicode filenames.
* Add authentication to the server so that the admin can modify the config file and all files in the public directory.

