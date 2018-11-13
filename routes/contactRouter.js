var express = require('express');
var bodyParser = require('body-parser');
var Contacts = require('../models/contact');

var contactRouter = express.Router();

contactRouter.use(bodyParser.json());

contactRouter.route('/')

    .get(function(req, res, next) {
        Contacts.find(req.query, function(err, contact) {
            if (err) return next(err);
            res.json(contact);
        });
    })

    .post(function(req, res, next) {
        Contacts.create(req.body, function(err, contact) {
            if (err) return next(err);

            var id = contact._id;
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Added the contact with id: ' + id);
        })
    })

    .delete(function(req, res, next) {
        Contacts.remove({}, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });

contactRouter.route('/:contactId')

    .get(function(req, res, next) {
        Contacts.findById(req.params.contactId, function(err, contact) {
            if (err) return next(err);
            res.json(contact);
        });
    })

    .put(function(req, res, next) {
        Contacts.findByIdAndUpdate(req.params.contactId, {
            $set: req.body
        }, {
            new: true
        }, function(err, contact) {
            if (err) return next(err);
            res.json(contact);
        });
    })

    .delete(function(req, res, next) {
        Contacts.findByIdAndRemove(req.params.contactId, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });

module.exports = contactRouter;