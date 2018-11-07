var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Question = require('../models/question');

var userData = require('../public/userdata.json');
var questionData = require('../public/questiondata.json');

router.get('/reset', function (req, res, next) {
    User.deleteMany({}, function(err) {
        if(err) return next(err);
    });
    
    for(var u in userData) {
        var temp = new User(userData[u]);

        temp.save(function (err) {
            if(err) return next(err);
        });
    }

    Question.deleteMany({}, function(err) {
        if(err) return next(err);
    });

    for(var q in questionData) {
        var temp = new Question(questionData[q]);

        temp.save(function (err) {
            if(err) return next(err);
        });
    }

    res.status(200).send();
});

module.exports = router;
