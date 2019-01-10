const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const sr = require('../response/serverResponse');
const dr = require('../response/databaseResponse');


const apiClients = mongoose.Schema({

    apiCredentials: {
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        created_at: {
            type: Date,
            defaut: Date.now()
        }
    }
    // connection_logs: {
    //     userID: {
    //         type: mongoose.Schema.Types.ObjectId
    //     },
    //     sessionKey: {
    //         type: String,
    //         required: true
    //     },
    //     created_at: {
    //         type: Date,
    //         defaut: Date.now()
    //     }
    // }
});

const Client = module.exports = mongoose.model('clients', apiClients);

module.exports.newCredentials = function (details, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(details.apiCredentials.password, salt, (err, hash) => {
            if (err) {
                dr.api_FailedResponse(err);
            } else {
                details.apiCredentials.password = hash;
                details.save(callback);
            }
        });
    });
}

module.exports.getClientUsingName = function (name, callback) {
    Client.findOne({
        'apiCredentials.username': name
    }, callback);
}

module.exports.getClientUsingID = function (id, callback) {
    Client.findById(id, '_id', callback);
}

module.exports.getClient = function (id, callback) {
    Client.findById(id,  callback);
}

module.exports.comparePassword = function(fromReqPWD, id, callback) {
    Client.getClient(id, (err, user) => {
        if (err) {
            dr.api_FailedResponse(err);
        }else {
            bcrypt.compare(fromReqPWD, user.apiCredentials.password, (err, result) => {
                if (err) {
                    dr.api_FailedResponse(err);
                }else {
                    callback(null, result);
                }
            });
        }
    });
}