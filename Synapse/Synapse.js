var qs = require("querystring");
var http = require("http");
const wr = require('../response/webResponse');
const dr = require('../response/databaseResponse');

const options = {
    "method": "POST",
    "hostname": "localhost",
    "port": "8080",
    "path": "/AeroLinkDBServer/apiPort",
    "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache"
    }
};

let isEmpty = function (s) {
    return s === "" ? true : false;
}

module.exports.execute = function (opts, callback) {

    var error = null;
    var result = null;



    if (isEmpty(opts['query'])) {
        error = "Empty query";
    }

    if (error === null) {

        if (opts['action'] == 'LOGIN') {
            wr.webNormal("Executing Login for : " + opts['query'])
            DML_PROC(opts['query'], opts['where'] ? opts['values'] : "", 'LOGIN', (data) => {
                result = data;
                callback(error, result);
            });
        }

        if (opts['action'] == 'GET') {
            wr.webNormal("Executing Query : " + opts['query'])
            get(opts['query'], opts['where'] ? opts['values'] : "", (data) => {
                result = data;
                callback(error, result);
            });
        }

        if (opts['action'] == 'INSERT') {
            wr.webNormal("Executing Query : " + opts['query'])
            DML_PROC(opts['query'], opts['where'] ? opts['values'] : "", 'INSERT', (data) => {
                result = data;
                callback(error, result);
            });
        }

        if (opts['action'] == 'INSERT_RT_ID') {
            wr.webNormal("Executing Query : " + opts['query'])
            DML_PROC(opts['query'], opts['where'] ? opts['values'] : "", 'INSERT_RT_ID', (data) => {
                result = data;
                callback(error, result);
            });
        }

        if (opts['action'] == 'UPDATE') {
            wr.webNormal("Executing Query : " + opts['query'])
            DML_PROC(opts['query'], opts['where'] ? opts['values'] : "", 'UPDATE', (data) => {
                result = data;
                callback(error, result);
            });
        }
    }
    callback(error, result);

}

let get = function (query, values = "", cb) {
    var result;

    dr.apiNormal(" Connecting to Backend Server ... ");
    var requestAerolinkDB = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var body = Buffer.concat(chunks);
            result = body.toString();
            cb(result);
            wr.webSuccess("Execution Complete : " + (JSON.parse(result).result).length + " " + ((JSON.parse(result).result).length <= 1 ? "result" : "results") + " found.");
        });
    });

    if (values != "") {
        dr.apiNormal("Sending Request with values");
        requestAerolinkDB.write(qs.stringify({
            "0x1009A": query,
            "0x1009B": values,
        }));
    } else {
        dr.apiNormal("Sending Request without any values");
        requestAerolinkDB.write(qs.stringify({
            "0x1009A": query,
        }));
    }

    requestAerolinkDB.end();
}

let DML_PROC = function (query, values = "", method, cb) {
    var result;

    dr.apiNormal(" Connecting to Backend Server ... ");
    var requestAerolinkDB = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var body = Buffer.concat(chunks);
            result = body.toString();
            cb(result);
            wr.webSuccess("Execution Complete : " + (result));
        });
    });

    dr.apiNormal("Sending Request with values");
    requestAerolinkDB.write(qs.stringify({
        "0x1009A": query,
        "0x1009B": values,
        "0x1009C": method,
    }));

    requestAerolinkDB.end();
}