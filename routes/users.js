var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/usernameValid/:username', function (req, res, next) {
  var username = req.params.username;
  //Write logic to query database and check if the username exists
  if (username === "nope") {
    res.status(403).send();
  }
  else {
    res.status(200).send();
  }
});

module.exports = router;
