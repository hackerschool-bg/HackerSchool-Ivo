var route = require('./router.js').route;

//create a TCP socket and handle it using the methods specified in web.js
var server = require('net').createServer(require('./miniHTTP').socketHandler(route));


server.listen(8080, function () {
  var address = server.address();
  console.log("http://%s:%s/", address.address, address.port);
});