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
router.put('/createUser', function(req, res, next) {
    // need to check passed parameters!
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
          res.status(403).send();
        }
      }
    });
});

module.exports = router;
