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

    .post(function(req, res, next) {
        Products.create(req.body, function(err, product) {
            if (err) return next(err);

            var id = product._id;
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Added the product with id: ' + id);
        });
    })

    .delete(function(req, res, next) {
        Products.remove({}, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
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

    .put(function(req, res, next) {
        Products.findByIdAndUpdate(req.params.productId, {
            $set: req.body
        }, {
            new: true
        }, function(err, product) {
            if (err) return next(err);
            res.json(product);
        });
    })

    .delete(function(req, res, next) {
        Products.findByIdAndRemove(req.params.productId, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });

module.exports = productRouter;