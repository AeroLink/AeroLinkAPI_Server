const colors = require('colors');

module.exports.startServer = function(port) {
    console.log("[" + "SERVER".green + "] -> " + 'Server is now up and running at port ' + port);
}

module.exports.closeServer = function() {
    console.log("[" + "SERVER".green + "] -> " + 'Server is now closed ' );
}

module.exports.errorServer = function(err) {
    console.log("[" + "SERVER".red + "] -> " + ('Error was been caught :' + err ).red );
}