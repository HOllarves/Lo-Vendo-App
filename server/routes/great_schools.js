'use strict'

/**
 * 
 * REQUIRES
 * 
 */

var express = require('express'),
    request = require('request'),
    greatSchoolsRouter = express.Router()
    


/**
 * Great Schools API GET request
 * @param {String} url - endpoint
 * @param {Function} anonymous
 */

greatSchoolsRouter.get('/', function (req, res) {
    var url = "https://api.greatschools.org/schools/nearby?key=2wxibitikcwl6hgdvklk3wxx";
    var query = {
        city: req.query.city,
        zip: req.query.zip,
        limit: req.query.limit,
        state: req.query.state
    }
    request({
        url: url,
        qs: query
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.json(body);
        } else {
            res.json({
                status: 401,
                message: "Bad request to great schools api"
            });
        }
    });
});

/**
 * 
 * MODULE EXPORTS
 * 
 */

module.exports = greatSchoolsRouter