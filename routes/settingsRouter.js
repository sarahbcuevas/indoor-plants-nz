var express = require('express');
var bodyParser = require('body-parser');
var Settings = require('../models/settings');
var Verify = require('./verify');

var settingsRouter = express.Router();

settingsRouter.use(bodyParser.json());

settingsRouter.route('/')

    .get(function(req, res, next) {
        Settings.findOne(req.query, function(err, settings) {
            if (err) return next(err);

            if (settings) {
                res.json(settings);
            } else {
                Settings.create(req.body, function(err, settings2) {
                    if (err) return next(err);
        
                    res.json(settings2);
                })
            }
        });
    })

    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        Settings.create(req.body, function(err, settings) {
            if (err) return next(err);

            var id = settings._id;
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Added the settings with id: ' + id);
        })
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        Settings.remove({}, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });

settingsRouter.route('/:settingsId')

    .get(function(req, res, next) {
        Settings.findById(req.params.settingsId, function(err, settings) {
            if (err) return next(err);
            res.json(settings);
        });
    })

    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        Settings.findByIdAndUpdate(req.params.settingsId, {
            $set: req.body
        }, {
            new: true
        }, function(err, settings) {
            if (err) return next(err);
            res.json(settings);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        Settings.findByIdAndRemove(req.params.settingsId, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });

module.exports = settingsRouter;