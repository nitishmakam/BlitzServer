var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/usernameValid/:username', function (req, res, next) {
  User.find({ username: req.params.username })
    .exec(function (err, user) {
      console.log(user);
      if (err) {
        res.status(403).send();
      } else {
        if (user.length == 0) {
          res.status(200).send();
        }
        else {
          res.status(403).send();
        }
      }
    });
});

module.exports = router;
