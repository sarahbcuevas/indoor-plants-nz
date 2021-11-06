var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Products = require('../models/products');
var Verify = require('./verify');

var productRouter = express.Router();

productRouter.use(bodyParser.json());

productRouter.route('/')

    .get(function(req, res, next) {
        Products.find(req.query)
            .populate('category')
            .exec(function(err, product) {
                if (err) return next(err);
                res.json(product);
        });
    })

    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        Products.create(req.body, function(err, product) {
            if (err) return next(err);
            res.json(product);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        Products.remove({}, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });

productRouter.route('/delete')

    /* DELETE mutliple orders by id */
    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        Products.deleteMany(
            { _id: { $in: req.body } }
          ).exec(function(err, resp) {
            if (err) return next(err);
            return res.json(resp);
          });
    });

productRouter.route('/:productId')

    .get(function(req, res, next) {
        Products.findById(req.params.productId)
            .populate('category')
            .exec(function(err, product) {
                if (err) return next(err);
                res.json(product);
        });
    })

    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        Products.findByIdAndUpdate(req.params.productId, {
            $set: req.body
        }, {
            new: true
        }, function(err, product) {
            if (err) return next(err);
            res.json(product);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        Products.findByIdAndRemove(req.params.productId, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });

module.exports = productRouter;