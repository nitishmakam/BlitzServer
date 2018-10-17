var express = require('express');
var router = express.Router();

var Question = require('../models/question');
var User = require('../models/user');

var async = require('async');

// Get all questions
router.get('/', function(req, res, next) {
    Question.find({})
        .populate({ path: 'user', select: 'username' })
        .populate({ path: 'answers.user', select: 'username' })
        .exec(function (err, questions) {
            if(err) return next(err);

            return res.json(questions);
        });
});

// Get question by id
router.get('/:id', function(req, res, next) {
    Question.find({_id: req.params.id})
        .populate({ path: 'user', select: 'username' })
        .populate({ path: 'answers.user', select: 'username' })
        .exec(function (err, question) {
            if(err) return next(err);

            return res.json(question);
        });
});

// Create new question. Takes user(ref) and text
router.put('/createquestion', function(req, res, next) {
    var question = new Question({
        user: req.body.user,
        text: req.body.text,
    });

    // validation needed
    question.save(function (err) {
        if(err) return next(err);

        return res.json({
            result: "success",
        });
    });
});

// Create new answer. Takes qid(ref), user(ref) and text
router.put('/createanswer', function(req, res, next) {
    Question.findOne({ _id: req.body.qid })
        .exec(function (err, question) {
            if(err) return next(err);

            if(!question) {
                return res.json({
                    result: "failure",
                    message: "Question does not exist",
                });
            }
            
            var answer = {
                text: req.body.text,
                user: req.body.user,
            };

            if(question.answers === undefined)
                question.answers = [answer];
            else
                question.answers.push(answer);

            question.save(function (err) {
                if(err) return next(err);

                return res.json({
                    result: "success",
                });
            });
        });
});

module.exports = router;
