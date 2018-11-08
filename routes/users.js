var express = require('express');
var router = express.Router();
var User = require('../models/user');

// Get all users
router.get('/', function (req, res, next) {
    User.find({})
        .exec(function (err, users) {
            if(err) return next(err);

            return res.json(users);
        });
});

// Create new user. Takes username, email, password
router.post('/signUp', function(req, res, next) {
    // need to check passed parameters!
    User.findOne({ username: req.body.username })
        .exec(function (err, user) {
            if(err) return next(err);

            if(user != null)
                return res.status(403).send();
        });

    var user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    });

    user.save(function (err) {
        if(err) return next(err);

        return res.status(200).send();
    });
});

// Very basic sign in. Takes username, password.
router.post('/signIn', function(req, res, next) {
    User.findOne({ username: req.body.username })
        .exec(function (err, user) {
            if(err) return next(err);
            console.log(user.password);
            console.log(req.body);
            if(!user || user.password != req.body.password)
                res.status(403).send();
            else
                res.status(200).send();
        });
});

// Checks if username already taken
router.get('/usernameValid/:username', function (req, res, next) {
  User.findOne({ username: req.params.username })
    .exec(function (err, user) {
      console.log(user);
      if (err) {
        res.status(403).send();
      } else {
        if (user == null) {
          res.status(200).send();
        }
        else {
          res.status(409).send();
        }
      }
    });
});

module.exports = router;
