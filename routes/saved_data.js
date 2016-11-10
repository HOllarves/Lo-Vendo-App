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
    s = rfr('routes/config/jwt_config.js'),
    User = rfr('models/User.js'),
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
    }, "meta.saved_houses", function (err, houses) {
        if (err || !houses) {
            res.json({
                status: 400,
                message: 'Bad Request'
            });
        } else {
            res.json({
                status: 200,
                message: 'Success',
                saved_houses: houses
            });
        }
    });
});

/**
 * Saved Searches GET request
 * @param {String} url - endpoint
 * @param {Function} anonymous
 */

savedDataRouter.get('/searches', function (req, res) {
    User.find({
        _id: req.query.id
    }, "meta.saved_searches", function (err, searches) {
        if (err || !searches) {
            res.json({
                status: 400,
                message: 'Bad Request'
            });
        } else {
            res.json({
                status: 200,
                message: 'Success',
                saved_searches: searches
            });
        }
    });
});

/**
 * 
 * MODULE EXPORTS
 * 
 */

module.exports = savedDataRouter