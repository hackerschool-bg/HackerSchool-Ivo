//pIndex.js is an alernative to index.js that offers dynamic portfinding
// WARNING: pIndex.js cannot be used with cluster.js because 
// pm2 relies on all clusters running on a single port

var route = require('./router.js').route,
    config = require('./config.js'),
    portfinder = require('portfinder');

//TODO: replicate the TCP server using socket.io to handle concurrency better
    //io = require('socket.io')();

//create a TCP socket and handle it using the methods specified in miniHTTP.js
try {
    var server = require('net').createServer(require('./miniHTTP').socketHandler(route));
} catch (e){
    console.log('The argument for TCP server creation is not an existing string or buffer.');
};

//portfinder looks for a free port on the chosen machine starting from the port speciefied is config.js
//modify the config file to change the host or the port number
try {
    portfinder.basePort = config.port;
    portfinder.getPort({host: config.host}, function(error, port) {
        if(error) {
            if(error.code === 'EADDRNOTAVAIL') {
                console.log('Host (%s) is not available.', config.host);
            } 
            
            else if(error.code === 'EADDRINUSE') {
                console.log('Port (%s) is taken.', config.port);
            } 
            
            else {
                console.log('An error has occured.');
            }
            process.exit(true);
        } 

        else {
            server.listen(port, function () {
                var address = server.address();
                console.log("Staring the server at: http://%s:%s/", address.address, address.port);
            });
        }
    });
} catch(e) {
    console.log(e.message);
};