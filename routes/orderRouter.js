var express = require('express');
var router = express.Router();
var passport = require('passport');
var Order = require('../models/order');
var Products = require('../models/products');
var Verify = require('./verify');

/* GET orders listing. */
router.get('/', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
  Order.find(req.query)
    .exec(function(err, order) {
      if (err) return next (err);
      res.json(order);
    });
});

/* GET order by id */
router.get('/:orderId', Verify.verifyOrdinaryUser, function(req, res, next) {
  Order.findById(req.params.orderId, function(err, order) {
    if (err) return next(err);
    res.json(order);
  }).populate({
    path: 'orderItems',
    populate: {
      path: 'product',
      model: 'Product'
    }
  })
});

/* UPDATE order */
router.put('/:orderId', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
  Order.findByIdAndUpdate(req.params.orderId, {
    $set: req.body
  }, {
    new: true
  }, function (err, order) {
    if (err) return next(err);
    res.json(order);
  })
});

router.post('/create', Verify.verifyOrdinaryUser, function(req, res, next) {
  Order.create(req.body, function(err, order) {
    if (err) return next(err);

    console.log('Order: ', order);
    let orderItems = order.orderItems;
    for (let i=0; i<orderItems.length; i++) {
      let productId = orderItems[i].product;
      let soldStock = orderItems[i].quantity;
      Products.findByIdAndUpdate(productId, {
        $inc: { 'stock': -soldStock }
      }, {
          new: true
      }, function(err, product) {
          if (err) return next(err);
          console.log('Updated stock of product: ', product);
      });
    }
    return res.json(order);
  });
});

router.delete('/:orderId', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
  Order.findByIdAndRemove(req.params.orderId, function(err, resp) {
    if (err) return next(err);
    res.json(resp);
  });
});

module.exports = router;
