'use strict';

/**
 * 
 * REQUIRES
 * 
 */

var passport = require('passport'),
  rfr = require('rfr'),
  s = rfr('routes/config/jwt_config.js'),
  User = rfr('models/User.js'),
  _ = require('lodash'),
  jwt = require('jsonwebtoken');


/**
 * 
 * MODULE EXPORTS
 * 
 */

module.exports.signIn = signInUser;
module.exports.signUp = signUpUser;

/**
 * Signs in user
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Object} next
 */

function signInUser(req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err || !user) {
      res.json({
        status: 400,
        message: "Bad Request"
      });
    }
    //Loging in
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      var token = jwt.sign(user, s.SECRET, {
        expiresIn: '1440m' //Expires in 24 hours
      });
      //Response
      res.json({
        status: 200,
        message: 'User signed in',
        user: user,
        token: token
      });
    });
  })(req, res, next);
};

/**
 * Signs up user
 *
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Object} next
 */

function signUpUser(req, res, next) {
  var userData = _.pick(req.body, 'name', 'email', 'password');
  User.register(userData, function (err, user) {
    if (err && (11000 === err.code || 11001 === err.code)) {
      res.json({
        status: 401,
        message: 'Email already in use'
      });
    }
    if (err) {
      res.json({
        status: 500,
        message: 'Internal Server Error'
      });
    }
    req.logIn(user, function (err) {
      res.json({
        status: 201,
        message: 'User signed up',
        user: user
      });
    });
  });
}