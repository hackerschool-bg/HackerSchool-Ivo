module.exports = config = {

// the address of the server
	'address': 'localhost',

// the server port
    'port': 8080,

// whether requests for directories should be handled    
    'dirs': false,

// supported extensions; all other will not be served (must be separated by [, ]) 
    'extensions': 'html, htm, js',

// show hidden files
    'hidden': true,

// public directory that the users can access; reqests to all other directories 
// that aren't children of the public directory will not be handled.
	'publicDir': 'public', 

// default file that will be searched in response to requests for (http://address:port) or (http://address:port/); 
// ordered from least important to most important (must be separated by [, ])   
    'index': 'index.html, main.html, start.html',

// change the theme of error messages and directory listings either dark or light
    'theme': 'dark'    
}