var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var Question = require('../models/question');
var User = require('../models/user');

var async = require('async');

router.use(function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(token) {
        jwt.verify(token, 'randomSecret', function(err, decoded) {
            if(err) {
                console.log('Failed to authenticate token');
                next();
            }
            else {
                console.log('Valid token!');
                res.locals.decoded = decoded;
                next();
            }
        });
    }
    else {
        console.log('No token provided');
        next();
    }
});

// Get all questions
router.get('/', function(req, res, next) {
    Question.find({}, { __v: 0, })
        .populate({ path: 'user', select: 'username -_id' })
        .populate({ path: 'answers.user', select: 'username -_id' })
        .exec(function (err, questions) {
            if(err) return next(err);

            return res.json(questions);
        });
});

// Get question by id
router.get('/:id', function(req, res, next) {
    Question.findOne({ _id: req.params.id }, { __v: 0, })
        .populate({ path: 'user', select: 'username -_id' })
        .populate({ path: 'answers.user', select: 'username -_id' })
        .exec(function (err, question) {
            if(err) return next(err);

            return res.json(question);
        });
});

// Create new question. Takes username and text
router.post('/createQuestion', function(req, res, next) {
    // need to validate sent params
    User.findOne({ username: req.body.username })
        .exec(function (err, user) {
            if(err) return next(err);

            if(user == null)
                return res.status(403).send();

            var question = new Question({
                user: user._id,
                text: req.body.text,
            });

            question.save(function (err) {
                if(err) return next(err);

                return res.status(200).json(question);
            });
        });
});

// Create new answer. Takes qid(ref), username and text
router.post('/createAnswer', function(req, res, next) {
    Question.findOne({ _id: req.body.qid })
        .exec(function (err, question) {
            if(err) return next(err);

            if(!question) {
                return res.status(403).json({
                    result: "failure",
                    message: "Question does not exist",
                });
            }
            
            User.findOne({ username: req.body.username })
                .exec(function (err, user) {
                    if(err) return next(err);

                    if(user == null)
                        return res.status(403).send();

                    var answer = {
                        text: req.body.text,
                        user: user._id,
                    };

                    if(question.answers === undefined)
                        question.answers = [answer];
                    else
                        question.answers.push(answer);

                    question.save(function (err) {
                        if(err) return next(err);
                    });

                    Question.findOne({ _id: question._id }, { __v: 0, })
                        .populate({ path: 'user', select: 'username -_id' })
                        .populate({ path: 'answers.user', select: 'username -_id' })
                        .exec(function (err, question) {
                            if(err) return next(err);

                            return res.status(200).json(question);
                        });
                });
        });
});

module.exports = router;
