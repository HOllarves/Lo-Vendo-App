'use strict'

/**
 * 
 * REQUIRES
 * 
 */

var express = require('express'),
    request = require('request'),
    rfr = require('rfr'),
    Contact = rfr('server/models/Contact.js'),
    contactRouter = express.Router();

/**
 * Creates new message
 * @param {String} url - endpoint
 * @param {Function} anonymous
 */

contactRouter.post('/', function (req, res) {
    var newMessage = {
        "name": req.body.name,
        "email": req.body.email,
        "mlsId": req.body.mlsId,
        "message": req.body.message
    }
    Contact.create(newMessage, function (err, message) {
        if (err) {
            res.json({
                status: 400,
                message: "Invalid data"
            });
        } else {
            res.json({
                status: 200,
                message: "Message sent"
            });
        }
    });
});

/**
 * 
 * MODULE EXPORTS
 * 
 */

module.exports = contactRouter;