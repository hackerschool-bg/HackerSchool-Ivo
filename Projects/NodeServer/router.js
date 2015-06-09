	// default configuration settings as specified by the user
var config = require('./config.js'),

	// creates directory listing for in html format for a directory without an index file
	generateDirListing = require('./generateDirListing.js'),

	// mime content types
	mime = require('mime'),

	// async filesystem module
	fs = require('graceful-fs');


exports.route = function route(req, res) {

	var file = req.url.path.substr(1);

	// regular expression that matches any filepath starting with the public directory specified in config.js
	var patt = new RegExp("^" + config.publicDir, "igm");

	// ignore all requests for files outside the public direcotory by changing the filepath to start with config.publicDir
	// alternatively send 404 to those requests
	if(!patt.test(String(file))){
		file = config.publicDir + '/' + file;

		//uncomment to send 404 to all requests for files not in the public directory
		//handleNotFound(res);
	}

	var basePath = file.replace(/\?\S+/gi,'');
	//proceed only if the file or directory exists on the server.
 	//if(fs.existsSync(file)) {
 	if(fs.existsSync(basePath)) {
 		fileStats = fs.statSync(basePath);
		//in case it exists check whether it is a file or a directory
		if(fileStats.isDirectory()) {
			handleDirectory(res, basePath);
		}
		//if the URL is (http://address:port) or (http://address:port/) the variable file === ''
		else if(fileStats.isFile()) {
			handleFile(res, basePath);
		}
		else {
 			handleNotFound(res);	 		
		}
 	}
 	else {
 		handleNotFound(res);
 	}
}

function handleNotFound(res){
	res(404, { "Content-Type": "text/plain" }, "ERROR 404");
}

function handleFile(res, file) {

	// get the content-type of the file
	var mimeType = mime.lookup(file);

	// split the file on every . to get the file extension
	var extension = file.split('.');
	var filename = file.split('/');
	// split the extensions property of the config file to get an array of all allowed extensions
   	var allowedExtensions = config.extensions.split(', ');

	// use isAllowed as a flag while checking whether the requested file could be opened according to config.js
   	var isAllowed = true;

	// ignore all hidden files (starting with .)   			
   	if(file.charAt(0) !== '.') {
   		isAllowed = false;
   		for (var i = allowedExtensions.length - 1; i >= 0; i--) {
   			if(allowedExtensions[i] === extension[extension.length-1]) {
   				isAllowed = true;
   				break;
   			}
   		};
   	}
   			

	// handle hidden files and filetypes according to the specifications in config.js; 
    if( (filename[filename.length - 1].charAt(0) === '.' && config.hidden) || isAllowed ) {
 		try {
			fs.readFile(file, function(error, data) {
 				res(200, { "Content-Type": mimeType }, data);
            });
		} catch (e) {
			console.log('An error occured while reading the file.');
			handleNotFound(res);
		}
    } 
    else {
        
		handleNotFound(res);
    }
}

function handleDirectory(res, file) {
	// get the landing page specified in config.js
	var index = config.index.split(', ');

	//in case a request is made for (http://address:port) or (http://address:port/) look in the current directory
	if(file === '/'){
		file='';
	}

	var foundIndex = false; 
	// for every landing page check if it exists in the requested directory in order of precedance
	// if a match is found the page is opened and we break from the loop
	for (var i = index.length - 1; i >= 0; i--) {
		//console.log(file + '' + index[i]);
		if(fs.existsSync(file + '' + index[i])) {
			handleFile(res, file + '' + index[i]);
			foundIndex = true;
			break;
		}
	};

	// generates an html page that lists all firectories and files according to the specifications in config.js
	// options are available for: showing hidden files, showing specific file extensions, and hiding directories
	if(!foundIndex){
		console.log('No index found');
		generateDirListing(res, file);
	}
}