var HTTPParser = process.binding("http_parser").HTTPParser;
var Stream = require('stream').Stream;
var urlParse = require('url').parse;

var STATUS_CODES = {
  '100': 'Continue',
  '101': 'Switching Protocols',
  '102': 'Processing',                 

  '200': 'OK',
  '201': 'Created',
  '202': 'Accepted',
  '203': 'Non-Authoritative Information',
  '204': 'No Content',
  '205': 'Reset Content',
  '206': 'Partial Content',
  '207': 'Multi-Status',               

  '300': 'Multiple Choices',
  '301': 'Moved Permanently',
  '302': 'Moved Temporarily',
  '303': 'See Other',
  '304': 'Not Modified',
  '305': 'Use Proxy',
  '307': 'Temporary Redirect',

  '400': 'Bad Request',
  '401': 'Unauthorized',
  '402': 'Payment Required',
  '403': 'Forbidden',
  '404': 'Not Found',
  '405': 'Method Not Allowed',
  '406': 'Not Acceptable',
  '407': 'Proxy Authentication Required',
  '408': 'Request Time-out',
  '409': 'Conflict',
  '410': 'Gone',
  '411': 'Length Required',
  '412': 'Precondition Failed',
  '413': 'Request Entity Too Large',
  '414': 'Request-URI Too Large',
  '415': 'Unsupported Media Type',
  '416': 'Requested Range Not Satisfiable',
  '417': 'Expectation Failed',
// in case teapot technology improves dramatically
  '418': 'I\'m a teapot',              
  '422': 'Unprocessable Entity',       
  '423': 'Locked',                     
  '424': 'Failed Dependency',          
  '425': 'Unordered Collection',       
  '426': 'Upgrade Required',           

  '500': 'Internal Server Error',
  '501': 'Not Implemented',
  '502': 'Bad Gateway',
  '503': 'Service Unavailable',
  '504': 'Gateway Time-out',
  '505': 'HTTP Version not supported',
  '506': 'Variant Also Negotiates',    
  '507': 'Insufficient Storage',       
  '509': 'Bandwidth Limit Exceeded',
  '510': 'Not Extended'                
};

var defaultConfig = {
  autoDate: true,
  autoServer: "node.js " + process.version,
  autoContentLength: true,
  autoChunked: true,
  autoConnection: true,
};

exports.socketHandler = function (app, options) {
  var config = Object.create(defaultConfig);
  
//overwrite the defaults with the option specified from the client (if any)
  for (var key in options) {
    config[key] = options[key];
  }

  return function (client) {
//new HTTPParser for every TCP connection
    var parser = new HTTPParser(HTTPParser.REQUEST);
    var req;

    function res(statusCode, headers, body) {

      var hasContentLength, hasTransferEncoding, hasDate, hasServer;

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

      var isStreaming = body && typeof body === "object" && typeof body.pipe === "function";

      
      //Log all unexpected status codes in the console
      if(statusCode!=200){
        console.log("----------");
        console.log(headers);
        console.log(body);
        console.log(statusCode);
        console.log(!hasContentLength);
        console.log(!hasTransferEncoding);
      }

      if (config.autoConnection) {
        if (req.shouldKeepAlive && (hasContentLength || hasTransferEncoding || statusCode == 304)) {
          headers["Connection"] = "keep-alive"
        }
        else {
          headers["Connection"] = "close"
          req.shouldKeepAlive = false
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

      if (body && !isStreaming) head += body;

      client.write(head);

      if (!isStreaming) {
        return done()
      }

      body.pipe(client);
      body.on("end", done);

    }//end of function res()

    function done() {
      if (req.shouldKeepAlive) {
        parser.reinitialize(HTTPParser.REQUEST);
      }
      else {
        client.end();
      }
    }

    parser.onHeadersComplete = function (info) {
      info.body = new Stream();
      info.body.readable = true;
      req = info;
      var rawHeaders = req.rawHeaders = req.headers;
      var headers = req.headers = {};
      for (var i = 0, l = rawHeaders.length; i < l; i += 2) {
        headers[rawHeaders[i].toLowerCase()] = rawHeaders[i + 1];
      }
      req.url = urlParse(req.url);
      app(req, res);
    }

    parser.onBody = function (buf, start, len) {
      req.body.emit("data", buf.slice(start, len));
    };

    parser.onMessageComplete = function () {
      req.body.emit("end");
    };

    client.on("data", function (chunk) {
      var ret = parser.execute(chunk, 0, chunk.length);
    });

    client.on("end", function () {
      parser.finish();
    });

  };
};