// if the server is started from cluster.js, several instances of index.js will be opened.

// index.js can alse be ran on a single core using node cIndex.js 
var route = require('./router.js').route,
    config = require('./config.js');

// create a TCP socket and handle it using the methods specified in miniHTTP.js
try {
    var server = require('net').createServer(require('./miniHTTP').socketHandler(route));
} catch (e){
    console.log('The argument for TCP server creation is not an existing string or buffer.');
};


try {
	// gets port number from config.port
	server.listen(config.port, function () {
	    var address = server.address();
	    console.log("Staring the server at: http://%s:%s/", address.address, address.port);
	});
} catch (e) {
	console.log(e.message);
};