var HTTPParser = process.binding("http_parser").HTTPParser;
var Stream = require('stream').Stream;
var urlParse = require('url').parse;

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
			console.log('HEADERS SENT');

			console.log(totalConnections++);

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

		  	console.log(req.url.pathname);
		  	//console.log('headers: ', client);
		  	//console.log('Request method:', req.method);
		  	route(req, res);
		}

		parser.onBody = function (buf, start, len) {
			console.log('BODY');

		  	req.body.emit("data", buf.slice(start, len));
		};

		parser.onMessageComplete = function () {
			console.log('END');
		  	req.body.emit("end");
		};

		function done() {
			console.log('DONE');

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

		function res(statusCode, headers, body) {
			//console.log('Status code: ' + statusCode);
			console.log('Body: ' + body);

		  	var hasDate,
		  		hasServer,
		  		hasContentLength, 
		  		hasTransferEncoding;

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

		  	if (!hasDate && config.autoDate) {
				headers["Date"] = (new Date).toUTCString();
		  	}

		  	if (!hasServer && config.autoServer) {
				headers["Server"] = config.autoServer;
		  	}

		  	var isStreaming = body && (typeof body === "object") && (typeof body.pipe === "function");

		  	if (body && !hasContentLength && !hasTransferEncoding) {
				if (!isStreaming && config.autoContentLength) {
			 		body += "";
			 		headers["Content-Length"] = Buffer.byteLength(body);
			 		hasContentLength = true;
				}
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


		if (config.autoConnection) {
			if (req.shouldKeepAlive && (hasContentLength || hasTransferEncoding || statusCode == 304)) {
			  	headers["Connection"] = "keep-alive";
			}
			else {
				headers["Connection"] = "close";
	         	req.shouldKeepAlive = false;
			}
		}


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

		head += "\r\n";

		if (body && !isStreaming){
			head += body;
		}

		client.write(head);

		if (!isStreaming) {
			return done();
		}

		body.pipe(client);
		body.on("end", done);

		}//end of function res()
  	};//end of anonymous return function
};