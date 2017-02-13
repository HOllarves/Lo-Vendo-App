'use strict'

/*
 *
 * REQUIRES
 *
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema

    /**
     * Creating Contact Schema for MongoDB
     * 
     */

var ContactSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

// compile Contact model
module.exports = mongoose.model('Contact', ContactSchema);