var config = require('./config.js'),
	fs = require('graceful-fs');

exports.route = function route(req, res) {
	console.log('The file is ' + fs.existsSync(req.url.path.substr(1)));

    var fileStats = fs.statSync(req.url.path.substr(1));

    console.log(fileStats);

	console.log('The repository ' + fileStats.isDirectory() );
	console.log('The File ' + fileStats.isFile() );

 	switch(req.method){
 		case "GET":
 			switch(req.url.path){
 				case "/":
 				case "/" + config.index:
 				res(200, { "Content-Type": "text/html" }, "<h1>Node.js is running</h1>\n");
 				break;

 				case "/" + "test.html":
 				res(200, { "Content-Type": "text/plain" }, "{'Content': 'type isn't HTML'}\n");
 				break;

 				default:
 				res(404, { "Content-Type": "text/plain" }, "ERROR 404");
 			}
 		break;

 		case "Post":
 			switch(req.url.path){
 			
 				default:
 				res(404, { "Content-Type": "text/plain" }, "ERROR 404");
 			}
 		break;

 		default: 
 		res(404, { "Content-Type": "text/plain" }, "ERROR 404");
 	}
}