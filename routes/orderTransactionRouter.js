var express = require('express');
var router = express.Router();
var passport = require('passport');
var OrderTransaction = require('../models/order_transaction');
var Verify = require('./verify');

/* GET orders transaction history by order_id. */
router.get('/:orderId', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    OrderTransaction.find(
        { orderId: req.params.orderId }
    ).exec(function(err, orderTransaction) {
      if (err) return next(err);
      return res.json(orderTransaction);
    });
});

/* POST order transaction */
router.post('/', Verify.verifyOrdinaryUser, function(req, res, next) {
    OrderTransaction.create(req.body, function(err, orderTransaction) {
        if (err) return next(err);
        return res.json(orderTransaction);
    });
});

module.exports = router;