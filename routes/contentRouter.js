var express = require('express');
var bodyParser = require('body-parser');
var Contents = require('../models/content');
var Verify = require('./verify');

var contentRouter = express.Router();

contentRouter.use(bodyParser.json());

contentRouter.route('/')

    .get(function(req, res, next) {
        Contents.find(req.query, function(err, content) {
            if (err) return next(err);
            res.json(content);
        });
    })

    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        Contents.create(req.body, function(err, content) {
            if (err) return next(err);

            var id = content._id;
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Added the content with id: ' + id);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        Contents.remove({}, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });

contentRouter.route('/:contentId')

    .get(function(req, res, next) {
        Contents.findById(req.params.contentId, function(err, content) {
            if (err) return next(err);
            res.json(content);
        });
    })

    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        Contents.findByIdAndUpdate(req.params.contentId, {
            $set: req.body
        }, {
            new: true
        }, function(err, content) {
            if (err) return next(err);
            res.json(content);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        Contents.findByIdAndRemove(req.params.contentId, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });

module.exports = contentRouter;    