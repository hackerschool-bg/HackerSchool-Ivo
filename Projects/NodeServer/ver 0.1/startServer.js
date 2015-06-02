'use strict';

var arciiArt = require('ascii-art'),
    colors = require('colors'),
    cursor = require('ansi')(process.stdout),
    opener = require('opener'),
    //string concatination
    pad = require('pad'),
    //address manipulation
    path = require('path'),
    //fast port checks
    portfinder = require('portfinder');

/* Change the posix connection limits so that more than 1000 concurrent connections can coexist
   var posix = require('posix');
   console.log(posix.getrlimit('nofile'));
   posix.setrlimit('nofile', { soft: 5000, hard:9000 });
   console.log(posix.getrlimit('nofile'));
*/

var Require = exports.Require = function(name) {
    return require(path.resolve(__dirname, 'server', name + '.js'));
};

var pkg = require(path.resolve(__dirname, '../package.json')),
    config = Require('config'),
    Server = Require('server');

function onSignalInterrupt(server) {
        console.log('The server is shutting down...');
        server.close(function() {
            process.exit(0);
        });
}

function onExit() {
    console.log('The server has stopped working.');
    cursor.reset();
    cursor.show();
}

function displaySplashScreen() {
        console.log('Server started');

        if(config.portChanged) {
            console.log('this port is taken');
        }
        console.log('staring the server at http://' + config.address + ':' + config.port);
}

function startServer(config) {
    var server = Server.createServer(config);
    server.listen(config.port, config.address, function() {
        if(config.open) {
            opener(config.protocol+'://'+config.address + ':' + config.port.toString());
        }
        displaySplashScreen();
    });
}

config.pkg = pkg;

config.protocol = 'http';
config.version = pkg.version;
config.versionInfo = '(version ' + pkg.version + ')';

// Check if the host/port are available; increment them if they aren't
try {
    portfinder.basePort = config.port;
    portfinder.getPort({host: config.address}, function(error, port) {

        if(error) {
            if(error.code === 'EADDRNOTAVAIL') {
                console.log('Address not available %s'.red, config.address);
            } else if(error.code === 'EADDRINUSE') {
                console.log('The port is taken (%s).'.red, config.port);
            } else {
                console.log('An error has occured.'.red);
            }
            process.exit(1);
        } else {
            config.portChanged = config.port !== port && config.port != 8080 ? config.port : false;
            config.port = port;
            startServer(config);
        }
    });
} catch(e) {}
