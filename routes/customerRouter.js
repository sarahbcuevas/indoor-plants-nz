var express = require('express');
var router = express.Router();
var passport = require('passport');
var Customer = require('../models/customer');
var Verify = require('./verify');

/* GET customers listing. */
router.get('/', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
  Customer.find(req.query)
    .exec(function(err, customer) {
      if (err) return next (err);
      res.json(customer);
    });
});

/* GET current customer's details*/
router.get('/details', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
  Customer.findById(req.decoded._id, function(err, profile) {
    if (err) return next(err);
    res.json(profile);
  });
});

/* GET customer by id */
router.get('/:customerId', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
  Customer.findById(req.params.customerId, function(err, profile) {
    if (err) return next(err);
    res.json(profile);
  })
});

/* UPDATE customer */
router.put('/:customerId', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
  Customer.findByIdAndUpdate(req.params.customerId, {
    $set: req.body
  }, {
    new: true
  }, function (err, customer) {
    if (err) return next(err);
    res.json(customer);
  })
});

router.post('/create', Verify.verifyOrdinaryUser, function(req, res, next) {
  Customer.create(req.body, function(err, customer) {
    if (err) return next(err);

    var id = customer._id;
    return res.json(customer);
  });
});

// router.post('/login', function(req, res, next) {
//   passport.authenticate('local', function(err, user, info) {
//     if (err) return next(err);

//     if (!user) {
//       return res.status(400).json({
//         err: info,
//         message: 'Invalid username and/or password'
//       });
//     }

//     req.logIn(user, function(err) {
//       if (err) {
//         return res.status(500).json({
//           err: 'Could not log in user'
//         });
//       }

//       var token = Verify.getToken({
//         "username": user.username,
//         "_id": user._id,
//         "role": user.role
//       });

//       res.status(200).json({
//         status: 'Login successful!',
//         success: true,
//         token: token
//       });
//     });
//   })(req, res, next);
// });

// router.get('/logout', function(req, res) {
//   req.logout();
//   res.status(200).json({
//     status: 'Bye!'
//   });
// });

router.delete('/:customerId', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res) {
  Customer.findByIdAndRemove(req.params.customerId, function(err, resp) {
    if (err) return next(err);
    res.json(resp);
  });
});

module.exports = router;
