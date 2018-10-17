var express = require('express');
var router = express.Router();

var Question = require('../models/question');
var User = require('../models/user');

var async = require('async');

router.get('/', function(req, res, next) {
    Question.find({})
        .populate({ path: 'user', select: 'username' })
        .populate({ path: 'answers.user', select: 'username' })
        .exec(function (err, questions) {
            if(err) return next(err);

            res.json(questions);
        });
});

module.exports = router;
