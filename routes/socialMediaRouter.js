var express = require('express');
var bodyParser = require('body-parser');
var SocialMedia = require('../models/social_media');
var Verify = require('./verify');

var socialMediaRouter = express.Router();

socialMediaRouter.use(bodyParser.json());

socialMediaRouter.route('/')

    .get(function(req, res, next) {
        SocialMedia.find(req.query, function(err, socialMedia) {
            if (err) return next(err);
            res.json(socialMedia);
        })
    })

    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        SocialMedia.create(req.body, function(err, socialMedia) {
            if (err) return next(err);

            var id = socialMedia._id;
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Added the social media with id: ' + id);
        })
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        SocialMedia.remove({}, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });

socialMediaRouter.route('/:socialMediaId')

    .get(function(req, res, next) {
        SocialMedia.findById(req.params.socialMediaId, function(err, socialMedia) {
            if (err) return next(err);
            res.json(socialMedia);
        });
    })

    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        SocialMedia.findByIdAndUpdate(req.params.socialMediaId, {
            $set: req.body
        }, {
            new: true
        }, function(err, socialMedia) {
            if (err) return next(err);
            res.json(socialMedia);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        SocialMedia.findByIdAndRemove(req.params.socialMediaId, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });

module.exports = socialMediaRouter;