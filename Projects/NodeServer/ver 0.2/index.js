//require('longjohn');

function start(req, res) {
  if (req.method === "GET" && req.url.path === "/") {
    res(200, { "Content-Type": "text/html" }, "<h1>Node.js is running</h1>\n");
  }
  else if (req.method === "GET" && req.url.path === "/test.html") {
    res(200, { "Content-Type": "text/plain" }, "{'Content': 'type isn't HTML'}\n");
  }
  else {
    res(404, {}, "");
  }
}

//create a TCP socket and handle it using the methods specified in web.js
var server = require('net').createServer(require('./miniHTTP').socketHandler(start));

server.listen(8080, function () {
  var address = server.address();
  console.log("http://%s:%s/", address.address, address.port);
});