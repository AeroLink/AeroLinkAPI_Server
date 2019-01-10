const colors = require('colors');

//Cores
module.exports.log_server_connection = function(data) {
    console.log("[" + "API".yellow + "][" + "DATABASE".green + "]  -> Successfully connected to the database : " + data);
}

module.exports.log_server_connecting = function(data) {
    console.log("[" + "API".yellow + "][" + "DATABASE".green + "] -> Connecting to : " + data);
}

module.exports.errorlogserver = function(err) {
    console.log("[" + "API".yellow + "][" + "DATABASE".red + "]  -> ERROR !! : " + (err + "").red );
}


//API Responses
module.exports.apiNormal = function(data) {
    console.log("[" + "API".yellow + "][" + "DATABASE".green + "] -> " + data);
}

module.exports.api_SuccessfulResponse = function(data) {
    console.log("[" + "API".yellow + "][" + "DATABASE".green + "] -> " + (data + "").green );
}

module.exports.api_FailedResponse = function(data) {
    console.log("[" + "API".yellow + "][" + "DATABASE".red + "] -> ERROR !! : " + (data + "").red );
}
