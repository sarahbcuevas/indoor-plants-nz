var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var mongoose = require('mongoose');
var superuser = require('../data/users/superuser');

var refreshRouter = express.Router();

refreshRouter.route('/')
    .get(function(req, res, next) {
        mongoose.connection.db.dropDatabase(
            res.render('refresh')
          );
          User.register(new User({ username: superuser.username }), superuser.password, function(err, user) {
            if (err) {
              console.log('Error in superuser registration: ', err);
            }
            user.role = 'superuser';
            user.save(function(err, user) {
              passport.authenticate('local')(req, res, function() {
                return res.status(200).json({status: 'Registration successful!'});
              })
            });
          });
    });

module.exports = refreshRouter;