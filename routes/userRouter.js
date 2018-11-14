var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');

/* GET users listing. */
router.get('/', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
  User.find(req.query)
    .exec(function(err, user) {
      if (err) return next (err);
      res.json(user);
    });
});

/* GET current user's details*/
router.get('/profile', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
  User.findById(req.decoded._id, function(err, profile) {
    if (err) return next(err);
    res.json(profile);
  });
});

/* GET user by id */
router.get('/:userId', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
  User.findById(req.params.userId, function(err, profile) {
    if (err) return next(err);
    res.json(profile);
  })
});

/* UPDATE user */
router.put('/:userId', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
  User.findByIdAndUpdate(req.params.userId, {
    $set: req.body
  }, {
    new: true
  }, function (err, user) {
    if (err) return next(err);
    res.json(user);
  })
});

router.post('/register', function(req, res) {
  User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
    if (err) {
      return res.status(500).json({err: err});
    }

    if (req.body.name) {
      user.name = req.body.name;
    }

    if (req.body.email) {
      user.email = req.body.email;
    }

    if (req.body.contact) {
      user.contact = req.body.contact;
    }

    if (req.body.address) {
      user.address = req.body.address;
    }

    if (req.body.role) {
      user.role = req.body.role;
    }

    user.save(function(err, user) {
      passport.authenticate('local')(req, res, function() {
        return res.status(200).json({status: 'Registration successful!'});
      })
    });
  });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err);

    if (!user) {
      return res.status(400).json({
        err: info,
        message: 'Invalid username and/or password'
      });
    }

    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }

      var token = Verify.getToken({
        "username": user.username,
        "_id": user._id,
        "role": user.role
      });

      res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token
      });
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

router.delete('/:userId', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res) {
  User.findByIdAndRemove(req.params.userId, function(err, resp) {
    if (err) return next(err);
    res.json(resp);
  });
});

module.exports = router;
