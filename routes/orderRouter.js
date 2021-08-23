var express = require('express');
var router = express.Router();
var passport = require('passport');
var Order = require('../models/order');
var Products = require('../models/products');
var Verify = require('./verify');

/* GET orders listing. */
router.get('/', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
  Order.find(req.query, function(err, order) {
    if (err) return next(err);
    return res.json(order);
  })
  .populate({
    path: 'orderItems',
    populate: {
      path: 'product',
      model: 'Product'
    }
  });
});

/* GET distinct order tags */
router.get('/tags', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
  Order.distinct('tags')
    .exec(function(err, tags) {
      if (err) return next (err);
      return res.json(tags);
    });
});

/* GET order by id */
router.get('/:orderId', Verify.verifyOrdinaryUser, function(req, res, next) {
  Order.findById(req.params.orderId, function(err, order) {
    if (err) return next(err);
    return res.json(order);
  }).populate({
    path: 'orderItems',
    populate: {
      path: 'product',
      model: 'Product'
    }
  })
});

/* ARCHIVE orders */
router.put('/archive', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
  Order.updateMany(
    { _id: { $in: req.body } },
    { $set: { 'orderStatus': 'Archived'} }
  ).exec(function(err, orders) {
    if (err) return next(err);
    return res.json(orders);
  });
});

/* UNARCHIVE orders */
router.put('/unarchive', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
  console.log('Orders: ', req.body);
  Order.updateMany(
    { _id: { $in: req.body } },
    { $set: { 'orderStatus': 'Open'} }
  ).exec(function(err, orders) {
    if (err) return next(err);
    return res.json(orders);
  });
});

/* CANCEL orders */
router.put('/cancel', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
  Order.updateMany(
    { _id: { $in: req.body } },
    { $set: { 'orderStatus': 'Canceled'} }
  ).exec(function(err, orders) {
    if (err) return next(err);
    return res.json(orders);
  });
});

/* CANCEL orders */
router.put('/uncancel', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
  Order.updateMany(
    { _id: { $in: req.body } },
    { $set: { 'orderStatus': 'Open'} }
  ).exec(function(err, orders) {
    if (err) return next(err);
    return res.json(orders);
  });
});

/* Mark orders as PAID */
router.put('/paid', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
  Order.updateMany(
    { _id: { $in: req.body } },
    { $set: { 'paymentStatus': 'Paid'} }
  ).exec(function(err, orders) {
    if (err) return next(err);
    return res.json(orders);
  });
});

/* Mark orders as UNPAID */
router.put('/unpaid', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
  Order.updateMany(
    { _id: { $in: req.body } },
    { $set: { 'paymentStatus': 'Pending'} }
  ).exec(function(err, orders) {
    if (err) return next(err);
    return res.json(orders);
  });
});

/* Mark orders as FULFILLED */
router.put('/fulfilled', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
  Order.updateMany(
    { _id: { $in: req.body } },
    { $set: { 'fulfillmentStatus': 'Fulfilled'} }
  ).exec(function(err, orders) {
    if (err) return next(err);
    return res.json(orders);
  });
});

/* Mark orders as UNFULFILLED */
router.put('/unfulfilled', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
  Order.updateMany(
    { _id: { $in: req.body } },
    { $set: { 'fulfillmentStatus': 'Unfulfilled'} }
  ).exec(function(err, orders) {
    if (err) return next(err);
    return res.json(orders);
  });
});

/* DELETE mutliple orders by id */
router.put('/delete', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
  Order.deleteMany(
    { _id: { $in: req.body } }
  ).exec(function(err, resp) {
    if (err) return next(err);
    return res.json(resp);
  });
});

/* UPDATE order */
router.put('/:orderId', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
  Order.findByIdAndUpdate(req.params.orderId, {
    $set: req.body
  }, {
    new: true
  }, function (err, order) {
    if (err) return next(err);
    return res.json(order);
  }).populate({
    path: 'orderItems',
    populate: {
      path: 'product',
      model: 'Product'
    }
  })
});

router.post('/', Verify.verifyOrdinaryUser, function(req, res, next) {
  Order.create(req.body, function(err, order) {
    if (err) return next(err);

    let orderItems = order.orderItems;
    for (let i=0; i<orderItems.length; i++) {
      let productId = orderItems[i].product._id;
      let soldStock = orderItems[i].quantity;
      Products.findByIdAndUpdate(productId, {
        $inc: { 'stock': -soldStock }
      }, {
          new: true
      }, function(err, product) {
          if (err) return next(err);
      });
    }
    return res.json(order);
  });
});

/* DELETE 1 order by id */
router.delete('/:orderId', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
  Order.findByIdAndRemove(req.params.orderId, function(err, resp) {
    if (err) return next(err);
    res.json(resp);
  });
});

module.exports = router;
