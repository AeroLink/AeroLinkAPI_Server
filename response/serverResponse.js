const colors = require('colors');

module.exports.startServer = function(port) {
    console.log("[" + "SERVER".green + "] -> " + 'Server is now up and running at port ' + port);
}

module.exports.success = function(message) {
    console.log("[" + "SERVER".green + "] -> " + message);
}


module.exports.closeServer = function() {
    console.log("[" + "SERVER".green + "] -> " + 'Server is now closed ' );
}

module.exports.errorServer = function(err) {
    console.log("[" + "SERVER".red + "] -> " + ('Error was been caught :' + err ).red );
}


module.exports.socketSuccess = function(message) {
    console.log("[" + "SOKCET".green + "] -> " + message.green);
}

module.exports.socketNormal = function(message) {
    console.log("[" + "SOKCET".green + "] -> " + message);
}

module.exports.socketError = function(err) {
    console.log("[" + "SOCKET".red + "] -> " + ('Error was been caught :' + err ).red );
}
