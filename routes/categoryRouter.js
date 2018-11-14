var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Categories = require('../models/categories');
var Verify = require('./verify');

var categoryRouter = express.Router();

categoryRouter.use(bodyParser.json());

categoryRouter.route('/')

    .get(function(req, res, next) {
        Categories.find(req.query)
            .populate('parent')
            .exec(function(err, category) {
                if (err) return next(err);
                res.json(category);
        });
    })

    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        Categories.create(req.body, function(err, category) {
            if (err) {
                console.log('error: ', err);
            }
            if (err) return next(err);

            var id = category._id;
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Added the category with id: ' + id);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        Categories.remove({}, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });

categoryRouter.route('/:categoryId')

    .get(function(req, res, next) {
        Categories.findById(req.params.categoryId)
            .populate('parent')
            .exec(function(err, category) {
                if (err) return next(err);
                res.json(category);
        });
    })

    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        Categories.findByIdAndUpdate(req.params.categoryId, {
            $set: req.body
        }, {
            new: true
        }, function(err, category) {
            if (err) return next(err);
            res.json(category);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        Categories.findByIdAndRemove(req.params.categoryId, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });

module.exports = categoryRouter;