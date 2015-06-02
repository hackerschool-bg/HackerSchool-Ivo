var bytes = require('bytes'),
    
    //fs = require('fs'),
//solution to the EMFILE error when trying to access more than a 1000 files concurrently
    fs = require('graceful-fs'),
    http = require('http'),
    mime = require('mime'),
    pad = require('pad'),
    path = require('path'),
    url = require('url');
    //LiveReloadServer = require('tiny-lr');

var Server = function(config) {

    if(!config) {
        throw 'ERROR: the server needs a configuration!';
    }

    function requestListener(request, response) {

        var ResponseObject = function(config, request, response){
            this.data = {};
            this.config = config;
            this.request = request;
            this.response = response;
            this.host = config.protocol + '://' + config.address + ':' + config.port;
// placeholder for http headers
            this.headers =  {};
        };

        var responseObject = new ResponseObject(config, request, response);

        responseObject.startTime = new Date(),
        responseObject.basePath = process.env.PWD,
        responseObject.documentRoot = path.normalize(responseObject.basePath + path.sep + responseObject.config.root + path.sep),
        responseObject.parsedUrl = url.parse(responseObject.host + responseObject.request.url, true),
        responseObject.pathName = responseObject.parsedUrl.pathname,
        responseObject.responseTime = responseObject.parsedUrl.query[responseObject.config.timeParam] ? responseObject.parsedUrl.query[responseObject.config.timeParam] : responseObject.config.time;
        responseObject.httpStatusCode = responseObject.config.statusCode ? responseObject.config.statusCode : 200;
        responseObject.httpStatusCode = responseObject.parsedUrl.query[responseObject.config.statusCodeParam] ? responseObject.parsedUrl.query[responseObject.config.statusCodeParam] : responseObject.httpStatusCode;
       
        responseObject.filePath = path.normalize(responseObject.documentRoot + responseObject.pathName);
        responseObject.config.windowSize = process.stdout.getWindowSize();

        var parsers = {
            directoryListing: function(responseObject, listingHtml){
                responseObject.data = parsers.parseFooter(responseObject).data.toString().replace(/##LISTING##/, listingHtml);
                return responseObject;
            },
            fileNotFound: function(responseObject) {
                return parsers.parseFooter(responseObject);
            },
            parseFooter: function(responseObject){
                if(responseObject.data){
                    responseObject.data = responseObject.data.toString()
                        .replace(/##URL##/, responseObject.parsedUrl.pathname)
                        .replace(/##VERSION##/, responseObject.config.version)
                        .replace(/##LINK##/, responseObject.config.pkg.homepage);
                }

                return responseObject;
            }
        };
       
        function router(responseObject) {

// is this an existing file or directory?
            if(fs.existsSync(responseObject.filePath)) {

                responseObject.fileStats = fs.statSync(responseObject.filePath);

                if(responseObject.fileStats.isDirectory()) {
                    handleDirectoryRequest(responseObject);
                } else if(responseObject.fileStats.isFile()) {
                    handleFileRequest(responseObject);
                }

            } else {
                fileNotFound(responseObject);
            }
        }
       
       
        function fileNotFound(responseObject) {
            var extension,
                notFoundPath;

// if request was for a favicon, send it
            if(responseObject.parsedUrl.pathname === '/favicon.ico'){
                sendFavicon(responseObject);
            } else {
// file not found, set 404 code unless status code has been overridden
                responseObject.httpStatusCode = responseObject.httpStatusCode === 200 ? 404 : responseObject.httpStatusCode;
                responseObject.headers['Content-Type'] = 'text/html';
                responseObject.fileName = '';

                for(var i = 0, l = responseObject.config.extensions.length; i < l + 1; ++i) {

                    extension = responseObject.config.extensions[i] ? '.' + responseObject.config.extensions[i] : '';
                    notFoundPath = path.normalize(responseObject.documentRoot + path.sep + responseObject.config['not-found'] + extension);

                    if(fs.existsSync(notFoundPath) && fs.statSync(notFoundPath).isFile()) {
                        responseObject.filePath = notFoundPath;
                        responseObject.fileName = path.normalize('/' + responseObject.config['not-found'] + extension);
                        break;
                    }
                }
                if(!responseObject.fileName) {
                    responseObject.filePath = path.normalize(__dirname + path.sep + '404.html');
                }
                readFile(responseObject, parsers.fileNotFound);
            }
        }
       
        function sendRedirect(responseObject){
            responseObject.httpStatusCode = 301;
            responseObject.response.writeHead(responseObject.httpStatusCode, responseObject.headers);
            responseObject.response.end();
        }
       
        function sendFavicon(responseObject){
            responseObject.headers['Content-Type'] = 'image/x-icon';
            responseObject.filePath = path.normalize(__dirname + path.sep + 'favicon.ico');
            readFile(responseObject);
        }
       
        function handleDirectoryRequest(responseObject){
            var location = '';

            function directoryRequest(responseObject){
                var index,
                    indexFilePath,
                    extension;

// try to find an index and serve that
                if(responseObject.config.index){
                    indexLoop:
                        for(var i = 0, l = responseObject.config.index.length; i < l; ++i) {
                            for(var j = 0, k = responseObject.config.extensions.length; j < k + 1; ++j) {
                                extension = responseObject.config.extensions[j] ? '.' + responseObject.config.extensions[j] : '';
                                index = path.normalize(responseObject.filePath + path.sep + responseObject.config.index[i] + extension);
                                if(fs.existsSync(index) && fs.statSync(index).isFile()) {
                                    indexFilePath = index;
                                    responseObject.fileName = path.normalize(path.sep + responseObject.config.index[i] + extension);
                                    break indexLoop;
                                }
                            }
                        }
                }

                if(!indexFilePath && true === responseObject.config.dirs) {
//if the URL is a directory create an HTML table with links to every file or folder in the current directory                   
                    responseObject.headers['Content-Type'] = 'text/html';
                    responseObject.fileName = responseObject.pathName;
                    responseObject.filePath = path.normalize(__dirname + path.sep + 'listing.html');

                    var createDirectoryListing = require('./directorylisting');
                    createDirectoryListing(responseObject, function(listingHtml){
                        readFile(responseObject, function(responseObject){
                            return parsers.directoryListing(responseObject, listingHtml);
                        });
                    });

                } else if(!indexFilePath && false === responseObject.config.dirs) {
                    fileNotFound(responseObject);
                } else{
                    // index found
                    responseObject.headers['Content-Type'] = mime.lookup(indexFilePath);
                    responseObject.filePath = indexFilePath;
                    readFile(responseObject);
                }
            }
            if(!/\/$/.test(responseObject.parsedUrl.pathname)){
                location = responseObject.host + responseObject.parsedUrl.pathname + '/';
                if(responseObject.parsedUrl.search){
                    location += responseObject.parsedUrl.search;
                }

                responseObject.headers['Location'] = location;
                sendRedirect(responseObject);
            } else {
                directoryRequest(responseObject);
            }

        }

        function handleFileRequest(responseObject) {
            responseObject.fileName = responseObject.pathName.substring(responseObject.pathName.lastIndexOf('/') + 1);
            var extension = path.extname(responseObject.fileName).substring(1);

            if(responseObject.fileName.charAt(0) === '.' && responseObject.config.hidden === false){
                fileNotFound(responseObject);
            } else {
                responseObject.headers['Content-Type'] = mime.lookup(responseObject.filePath);
                readFile(responseObject);
            }
        }

        function readFile(responseObject, parser) {

            fs.readFile(responseObject.filePath, function(error, data) {
                responseObject.headers['Content-Type'] = responseObject.headers['Content-Type'] ? responseObject.headers['Content-Type'] : mime.lookup(path.normalize(responseObject.documentRoot + path.sep + responseObject.request.url));
                responseObject.data = data;

                if(error) {
                    console.log('ERROR', error);
                }

                if(parser) {
                    responseObject = parser(responseObject);
                }

                sendFile(error, responseObject);
            });
        }

        function sendFile(error, responseObject) {
            var wait;

            function send(responseObject){
                responseObject.response.writeHead(responseObject.httpStatusCode, responseObject.headers);
                responseObject.response.write(responseObject.data);
                responseObject.response.end();

                var col1 = 15,
                    col2 = 10,
                    responseString = pad('response: ', col1) + pad(responseObject.httpStatusCode.toString(), col2) + ' ' + responseObject.fileName,
                    realResponseTime = (new Date()).getTime() - responseObject.startTime,
                    fileSizeString = bytes(responseObject.data.length || 0);

                console.log((pad('request: ', col1) + pad(responseObject.request.method, col2) + ' ' + responseObject.request.url).grey);
                console.log(responseString.grey);
                console.log((pad('response time: ', col1) + pad(realResponseTime + 'ms', col2)).grey);
                console.log((pad('file size: ', col1) + fileSizeString).grey);
                console.log(pad('-', responseObject.config.windowSize[0], '-').grey);
            }

            if(error){
                console.log('ERROR:: '.red, error);
            }

            if(responseObject.data){
                responseObject.headers['Content-Length'] = responseObject.data.toString().length;
            }

            wait = responseObject.responseTime - ((new Date()) - responseObject.startTime);
            wait = wait < 0 ? 0 : wait;

            setTimeout(function() {
               
               try {
                  send(responseObject);
               } catch(e) {
                  console.log('file could not be sent;');
               }
               
            }, wait);
        }
        router(responseObject);
    }
   
   try {
      this.server = http.createServer(requestListener);
   } catch(e) {
      console.log('The  argument for server creation is neither a string nor a buffer.');
   }
};

Server.prototype.listen = function() {
    this.server.listen.apply(this.server, arguments);
};

Server.prototype.close = function(callback) {
    return this.server.close(callback);
};

exports.createServer = function(config) {
    return new Server(config);
};