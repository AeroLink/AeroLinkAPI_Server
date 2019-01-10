const colors = require('colors');

//Web Responses

module.exports.webNormal = function(data) {
    console.log("[" + "API".yellow + "][" + "HTTP".green + "] -> " + data);
}

module.exports.webSuccess = function(data) {
    console.log("[" + "API".yellow + "][" + "HTTP".green + "] -> " + (data + "").green);
}

module.exports.webFailed = function(data) {
    console.log("[" + "API".yellow + "][" + "HTTP".red + "] -> ERROR !! : " + (data + "").red );
}
