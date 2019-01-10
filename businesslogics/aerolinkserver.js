const mongoose = require('mongoose');
const config = require('../config/database');
const dr = require('../response/databaseResponse');

module.exports.establishedLogDBServer = function () {

    dr.log_server_connecting(config.database);

    //connecting to mongo db
    mongoose.connect(config.database, {
        useMongoClient: true
    });

    //connected to the database
    mongoose.connection.on('connected', () => {
        dr.log_server_connection(config.database);
    })

    mongoose.connection.on('error', (err) => {
        dr.errorlogserver(err);
    });
}