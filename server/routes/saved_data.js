'use strict'

/**
 * 
 * REQUIRES
 * 
 */

var express = require('express'),
    savedDataRouter = express.Router(),
    mongoose = require('mongoose'),
    rfr = require('rfr'),
    s = rfr('server/routes/config/jwt_config.js'),
    User = rfr('server/models/User.js'),
    jwt = require('jsonwebtoken');

/**
 * 
 * Token middleware
 * 
 */

savedDataRouter.use(function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    //If we receive a token from the request
    if (token) {
        //Verifying authenticity of the token
        jwt.verify(token, s.SECRET, function (err, decoded) {
            if (err) {
                return res.json({
                    status: 400,
                    message: 'Unable to authenticate token'
                });
            } else {
                //Successful decoding, appending token to request
                req.decoded = decoded;
                //Moving to the next middleware
                next();
            }
        })
    } else {
        //Token failed authentication
        res.json({
            status: 401,
            message: 'Forbidden'
        });
    }
});

/**
 * Saved Houses GET request
 * @param {String} url - endpoint
 * @param {Function} anonymous
 */

savedDataRouter.get('/houses', function (req, res) {
    User.find({
        _id: req.query.id
    }, 'saved_houses', function (err, houses) {
        if (err || !houses) {
            res.json({
                status: 400,
                message: 'Bad Request'
            });
        } else {
            res.json(houses);
        }
    });
});

/**
 * Saved Houses POST request
 * @param {String} url - endpoint
 * @param {Function} anonymous
 */

savedDataRouter.post('/houses', function (req, res) {
    var saved_house = {
        "mlsId": req.body.mlsId,
        "addressFull": req.body.addressFull,
        "bedrooms": req.body.bedrooms,
        "listPrice": req.body.listPrice,
        "photo": req.body.photo,
        "bathrooms": req.body.bathrooms,
        "sqft": req.body.sqft
    }
    User.findOneAndUpdate({
            _id: req.body.userId
        }, {
            $push: {
                saved_houses: saved_house
            }
        }, {
            new: true
        },
        function (err, doc) {
            if (err) {
                res.json({
                    status: 400,
                    message: "Unable to save house"
                });
            } else {
                res.json(doc.saved_houses);
            }
        });
});

/**
 * Saved Houses PUT request
 * @param {String} url - endpoint
 * @param {Function} anonymous
 */

savedDataRouter.put('/houses/:id', function (req, res) {
    User.findOneAndUpdate({
            _id: req.query.userId
        }, {
            $pull: {
                saved_houses: {
                    _id: req.params.id
                }
            }
        }, {
            new: true
        },
        function (err, doc) {
            if (err || !doc) {
                res.json({
                    status: 400,
                    message: "Unable to remove house"
                });
            } else {
                res.json(doc);
            }
        });
})

/**
 * Saved Searches GET request
 * @param {String} url - endpoint
 * @param {Function} anonymous
 */

savedDataRouter.get('/searches', function (req, res) {
    User.find({
        _id: req.query.id
    }, 'saved_searches', function (err, searches) {
        if (err || !searches) {
            res.json({
                status: 400,
                message: 'Bad Request'
            });
        } else {
            res.json(searches);
        }
    });
});

/**
 * Saved Searches POST request
 * @param {String} url - endpoint
 * @param {Function} anonymous
 */

savedDataRouter.post('/searches', function (req, res) {
    User.findByIdAndUpdate({
            _id: req.body.userId
        }, {
            $push: {
                saved_searches: {
                    search_name: req.body.search_name,
                    filters: req.body.filters
                }
            },
        }, {
            new: true
        },
        function (err, doc) {
            if (err || !doc) {
                res.json({
                    status: 400,
                    message: "Unable to save search." + err

                });
            } else {
                return res.json(doc);
            }
        });
});

/**
 * Saved searches PUT request
 * @param {String} url - endpoint
 * @param {Function} anonymous
 */

savedDataRouter.put('/searches/:id', function (req, res) {
    console.log(req.headers);
    User.findOneAndUpdate({
            _id: req.query.userId
        }, {
            $pull: {
                saved_searches: {
                    _id: req.params.id
                }
            }
        }, {
            new: true
        },
        function (err, doc) {
            if (err || !doc) {
                res.json({
                    status: 400,
                    message: "Unable to remove search"
                });
            } else {
                res.json(doc);
            }
        });
})



/**
 * 
 * MODULE EXPORTS
 * 
 */

module.exports = savedDataRouter