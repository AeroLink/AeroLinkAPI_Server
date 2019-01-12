const express = require('express');
const router = express.Router();
const Client = require('../model/clients');
const dr = require('../response/databaseResponse');
const config = require('../config/env');
const wr = require('../response/webResponse');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const synapse = require('../Synapse/Synapse');

const bcrypt = require('bcryptjs');

const sc = "3d3nr4m0n3d4143589123456987";

let checkSC = function (fromBD, callback) {
    bcrypt.compare(sc, fromBD, (err, result) => {
        if (err) {
            dr.api_FailedResponse(err);
        } else {
            callback(null, result);
        }
    });
}

router.get('/wow', (req, res, next) => {
    res.json({
        "a" : "a"
    });
});

router.post('/login', (req, res, next) => {

    dr.apiNormal("Logging in ...");

    if (req.body.sestok === new Date().toLocaleDateString()) {
        synapse.execute({
            query: req.body.hasOwnProperty('A1009') ? req.body.A1009 : "",
            action: 'LOGIN',
            where: req.body.hasOwnProperty('B1009'),
            values: req.body.hasOwnProperty('B1009') ? req.body.B1009 : ""
        }, (err, result_set) => {
            if (err) {
                wr.webFailed(err);
                res.json({
                    success: false,
                    message: err
                });
            }

            if (result_set) {

                var r = JSON.parse(result_set).result[1];
                if (JSON.parse(result_set).result[0].success) {
                    dr.apiNormal("Checking if client was already existing ...");

                    Client.getClientUsingName(r.username, (err, user) => {
                        if (err) {
                            dr.api_FailedResponse(err);
                        } else {
                            ClientExist(user);
                        }
                    });

                    var requestClient = new Client({
                        apiCredentials: {
                            username: r.username,
                            password: r.password
                        }
                    });

                    function ClientExist(isClientExist) {
                        if (!isClientExist) {
                            dr.apiNormal("Client is not existing, Creating new credentials");
                            Client.newCredentials(requestClient, (err, user) => {
                                if (err) {
                                    wr.webFailed(err);
                                    res.json({
                                        success: false,
                                        message: "Registering new connection to api server failed"
                                    });
                                } else {
                                    if (user) {

                                        var userPayload = {
                                            _id: user._id
                                        }

                                        dr.api_SuccessfulResponse(user.apiCredentials.username + " credentials was created");
                                        wr.webSuccess("New Connection Made to " + user.apiCredentials.username + " [ id: " + user._id + "]");

                                        const token = jwt.sign(userPayload, config.secretToken + "|" + req.body.sestok, {
                                            expiresIn: 604800
                                        });

                                        res.json({
                                            success: true,
                                            message: "New Connection Made",
                                            token: 'Bearer ' + token,
                                            //return data
                                            id: r.id,
                                        });
                                    }
                                }
                            });
                        } else {
                            dr.apiNormal("Client is existing, Checking credentials");
                            //Check the keys

                            Client.comparePassword(r.password, isClientExist._id, (err, isMatched) => {
                                if (err) {
                                    wr.webFailed(err);
                                    res.json({
                                        success: false,
                                        message: "Registering new connection to api server failed"
                                    });
                                } else {

                                    if (isMatched) {
                                        var userPayload = {
                                            _id: isClientExist._id
                                        }

                                        wr.webSuccess("New Connection Made to " + isClientExist.apiCredentials.username + " [ id: " + isClientExist._id + "]");

                                        const token = jwt.sign(userPayload, config.secretToken + "|" + req.body.sestok, {
                                            expiresIn: 15000
                                        });

                                        res.json({
                                            success: true,
                                            message: "New Connection Made",
                                            token: 'Bearer ' + token,
                                            //return data
                                            id: r.id,
                                        });
                                    }
                                }
                            });
                        }
                    }

                } else {
                    wr.webFailed("Wrong Credentials");
                    res.json({
                        "success": false,
                        "message": "Wrong Credentials"
                    })
                }
            }

        });
    } else {

        wr.webFailed("Wrong Session Token");
        res.json({
            "success": false,
            "message": "unable to connect"
        })
    }
});

//TODO: Add Whitelist of IP
//TODO: Will Create Logs for connections
router.post('/connect', (req, res, next) => {

    wr.webNormal("Client process /connect api route ...");

    wr.webNormal("Checking secret key ...");


    checkSC(req.body.aerolink_secret_key, (err, data) => {
        if (data) {

            wr.webSuccess("SECRET KEY ACCEPTED ...");
            res.json({
                success: true,
                value: new Date().toLocaleDateString(),
                message: "Connected"
            });

        } else {

            wr.webFailed("Wrong SECRET KEY");
            res.json({
                success: false,
                message: "Wrong Key"
            });
        }
    });




});


router.post('/get', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    //the real game starts here -> WIP Cardinal System
    synapse.execute({
        query: req.body.hasOwnProperty('A1009') ? req.body.A1009 : "",
        action: 'GET',
        where: req.body.hasOwnProperty('B1009'),
        values: req.body.hasOwnProperty('B1009') ? req.body.B1009 : "",
        refresh: req.body.hasOwnProperty('refresher') ? req.body.refresher : "false",
    }, (err, result_set) => {
        if (err) {
            wr.webFailed(err);
            res.json({
                success: false,
                message: err
            });
        }

        if (result_set) {
            res.json({
                'success': true,
                'result_set': JSON.parse(result_set)
            });
        }

    });
});

router.post('/insert', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    //the real game starts here -> WIP Cardinal System
    synapse.execute({
        query: req.body.hasOwnProperty('A1009') ? req.body.A1009 : "",
        action: 'INSERT',
        where: req.body.hasOwnProperty('B1009'),
        values: req.body.hasOwnProperty('B1009') ? req.body.B1009 : ""
    }, (err, result_set) => {
        if (err) {
            wr.webFailed(err);
            res.json({
                success: false,
                message: err
            });
        }

        if (result_set) {
            res.json({
                'success': true,
                'result_set': JSON.parse(result_set)
            });
        }

    });
});

router.post('/insert_rt_id', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    //the real game starts here -> WIP Cardinal System
    synapse.execute({
        query: req.body.hasOwnProperty('A1009') ? req.body.A1009 : "",
        action: 'INSERT_RT_ID',
        where: req.body.hasOwnProperty('B1009'),
        values: req.body.hasOwnProperty('B1009') ? req.body.B1009 : ""
    }, (err, result_set) => {
        if (err) {
            wr.webFailed(err);
            res.json({
                success: false,
                message: err
            });
        }

        if (result_set) {
            res.json({
                'success': true,
                'result_set': JSON.parse(result_set)
            });
        }

    });
});

router.post('/update', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    //the real game starts here -> WIP Cardinal System
    synapse.execute({
        query: req.body.hasOwnProperty('A1009') ? req.body.A1009 : "",
        action: 'UPDATE',
        where: req.body.hasOwnProperty('B1009'),
        values: req.body.hasOwnProperty('B1009') ? req.body.B1009 : ""
    }, (err, result_set) => {
        if (err) {
            wr.webFailed(err);
            res.json({
                success: false,
                message: err
            });
        }

        if (result_set) {
            res.json({
                
                'success': true,
                'result_set': JSON.parse(result_set)
            });
        }

    });
});


module.exports = router;