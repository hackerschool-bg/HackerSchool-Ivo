var HTTPParser = process.binding("http_parser").HTTPParser;
var Stream = require('stream').Stream;
var urlParse = require('url').parse;

var cppMath = require('./cppMath.js');
var STATUS_CODES = require('./statusCode.js').STATUS_CODES;

var defaultConfig = {
  autoDate: true,
  autoServer: "node.js " + process.version,
  autoContentLength: true,
  autoChunked: true,
  autoConnection: true,
};

var totalConnections = 0;

exports.socketHandler = function (route, options) {

	var config = Object.create(defaultConfig);
  
	//overwrite the defaults with the option specified from the client (if any)
  	for (var key in options) {
		config[key] = options[key];
  	}

  	return function (client) {
  		//console.log(client);

	  	client.on('error',function(err){
	  		console.error(err)
	  	});

		var parser = new HTTPParser(HTTPParser.REQUEST),
			req;

		parser.onHeadersComplete = function (info) {
			//console.log('HEADERS SENT');

			//console.log(totalConnections++);

		  	info.body = new Stream();
		  	info.body.readable = true;
		  	req = info;
		  	var rawHeaders = req.rawHeaders = req.headers,
		  		headers = req.headers = {};

			//every other field is needed otherwise we get dublicate data
		  	for (var i = 0, length = rawHeaders.length; i < length; i += 2) {
				headers[rawHeaders[i].toLowerCase()] = rawHeaders[i + 1];
		  	}

		  	req.url = urlParse(req.url);

		  	//console.log(req.url.pathname);
		  	//console.log('headers: ', client);
		  	//console.log('Request method:', req.method);

		  	
		  	if(/cppCall/.test(req.url.query)) {
		  		console.log("call cpp");
		  		cppMath.calculate(req, res);

		  	} else {
		  		console.log("call normal");
		  		route(req, res);
		  	}
		}

		// display the body of the HTTP response
		parser.onBody = function (buf, start, len) {
		  	req.body.emit("data", buf.slice(start, len));
		};

		// send a dignal for end of response
		parser.onMessageComplete = function () {
			//console.log('END');
		  	req.body.emit("end");
		};

		// terminate the connection OR keep it depending on the request keepAlive property
		function done() {
			//console.log('DONE');

		  	if (req.shouldKeepAlive) {
				parser.reinitialize(HTTPParser.REQUEST);
		 	}
		 	else {
				client.end();
		  	}
		}

		client.on("data", function (chunk) {
		  var ret = parser.execute(chunk, 0, chunk.length);
		});

		client.on("end", function () {
		  parser.finish();
		});

		// handle the response according to te status code & headers
		function res(statusCode, headers, body) {
			//console.log('Status code: ' + statusCode);

		  	var hasDate,
		  		hasServer,
		  		hasContentLength, 
		  		hasTransferEncoding;

		  	// if any of (time, server, content-length, transfer-encoding) are not specified mark them
		  	for (var key in headers) {
				switch (key.toLowerCase()) {
			  		case "date":
					hasDate = true;
					continue;

			 		case "server":
					hasServer = true;
					continue;

			  		case "content-length":
					hasContentLength = true;
					continue;

			  		case "transfer-encoding":
					hasTransferEncoding = true;
					continue;
				}
		  	}

		  	// apply default values to the marked options
		  	if (!hasDate && config.autoDate) {
				headers["Date"] = (new Date).toUTCString();
		  	}

		  	if (!hasServer && config.autoServer) {
				headers["Server"] = config.autoServer;
		  	}

		  	// check whether the file should be sent as a stream
		  	var isStreaming = body && (typeof body === "object") && (typeof body.pipe === "function");

		  	if (body && !hasContentLength && !hasTransferEncoding) {
		  		// if there is no need for a stream modify Content-Length
				if (!isStreaming && config.autoContentLength) {
			 		body += "";
			 		headers["Content-Length"] = Buffer.byteLength(body);
			 		hasContentLength = true;
				}
				// otherwise if chuncked encoding is allowed in the config file use it
				else if (config.autoChunked) {
			 		headers["Transfer-Encoding"] = "chunked";
			 		hasTransferEncoding = true;
			 		var originalBody = body;
			 		body = new Stream();
			 		body.readable = true;

			  		originalBody.on("data", function (chunk) {
						if (Buffer.isBuffer(chunk)) {
				 			body.emit("data", chunk.length.toString(16).toUpperCase() + "\r\n");
				 			body.emit("data", chunk);
				 			body.emit("data", "\r\n");
				 			return;
						}
						var length = Buffer.byteLength(chunk);
						body.emit("data", length.toString(16).toUpperCase() + "\r\n" + chunk + "\r\n");
			  		});

			  		originalBody.on("end", function () {
						body.emit("data", "0\r\n\r\n\r\n");
						body.emit("end")
			  		});
				}
		  	}

		/*
		if (config.autoConnection) {
			if (req.shouldKeepAlive && (hasContentLength || hasTransferEncoding || statusCode == 304)) {
			  	headers["Connection"] = "keep-alive";
			}
			else {
				headers["Connection"] = "close";
	         	req.shouldKeepAlive = false;
			}
		}*/

		// *TESTTING* all connections are set to keep-alive
		headers["Connection"] = "keep-alive";

		// get the status code and throw an error if it is not icluded in STATUS_CODES
		var reasonPhrase = STATUS_CODES[statusCode];

		if (!reasonPhrase) {
			throw new Error("Invalid response code " + statusCode);
		}

		//write http headers 
		var head = "HTTP/1.1 " +
					statusCode + " " +
					reasonPhrase + "\r\n";


		for (var key in headers) {
			head += key + ": " + headers[key] + "\r\n";
		}

		// add the body of the http response
		head += "\r\n";
		if (body && !isStreaming){
			head += body;
		}

		// send the response to the client
		client.write(head);

		if (!isStreaming) {
			return done();
		}

		body.pipe(client);
		body.on("end", done);

		}//end of function res()
  	};//end of anonymous return function
};