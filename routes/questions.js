var request = require('request');
var express = require('express');
var router = express.Router();

var Question = require('../models/question');
var User = require('../models/user');

var auth = require('./auth');

var async = require('async');

router.use(auth);

// Get all questions
router.get('/', function (req, res, next) {
    Question.find({}, { __v: 0, })
        .populate({ path: 'user', select: 'username -_id' })
        .populate({ path: 'answers.user', select: 'username -_id' })
        .exec(function (err, questions) {
            if (err) return next(err);

            return res.json(questions);
        });
});

// Get question by id
router.get('/:id', function (req, res, next) {
    Question.findOne({ _id: req.params.id }, { __v: 0, })
        .populate({ path: 'user', select: 'username -_id' })
        .populate({ path: 'answers.user', select: 'username -_id' })
        .exec(function (err, question) {
            if (err) return next(err);

            return res.json(question);
        });
});

// Create new question. Takes username and text
router.post('/createQuestion', function (req, res, next) {
    if (!res.locals || !res.locals.decoded)
        return res.status(403);

    var question = new Question({
        user: res.locals.decoded._id,
        text: req.body.text,
    });

    question.save(function (err) {
        if (err) return next(err);

        return res.status(200).json(question);
    });
});

// Create new answer. Takes qid(ref), username and text
router.post('/createAnswer', function (req, res, next) {
    if (!res.locals || !res.locals.decoded)
        return res.status(403).send();

    Question.findOne({ _id: req.body.qid }, { __v: 0, })
        .populate({ path: 'user', select: 'username -_id' })
        .populate({ path: 'answers.user', select: 'username -_id' })
        .exec(function (err, question) {
            if (err) return next(err);

            if (!question)
                return res.status(403).send();

            var answer = {
                text: req.body.text,
                user: res.locals.decoded._id,
            };

            if (question.answers === undefined)
                question.answers = [answer];
            else
                question.answers.push(answer);

            request.post('https://oopspam.herokuapp.com',
                { json: { text: req.body.text, } },
                function (error, response, body) {

                    if (error || response.statusCode != 200) {
                        if (!error || error.code !== 'ETIMEDOUT')
                            return res.status(409).send();
                        console.log("Could not reach spam checker!");
                    } else if (body.nospam < body.spam) {
                        return res.status(409).json({ text: 'spam' });
                    }
                    console.log(body);

                    question.save(function (err) {
                        if (err) return next(err);

                        return res.status(200).json(question.answers[question.answers.length - 1]);
                    });
                });

        });
});

router.get('/questionsBy/:username', function (req, res, next) {
    if (!res.locals || !res.locals.decoded)
        return res.status(403).send();

    var uname = req.params.username || res.locals.decoded.username;

    User.findOne({ username: uname })
        .exec(function (err, user) {
            if (err) return next(err);

            Question.find({ user: user._id }, { __v: 0, })
                .populate({ path: 'user', select: 'username -_id' })
                .populate({ path: 'answers.user', select: 'username -_id' })
                .exec(function (err, questions) {
                    if (err) return next(err);

                    return res.status(200).json(questions);
                });
        });
});

router.get('/answersBy/:username', function (req, res, next) {
    if (!res.locals || !res.locals.decoded)
        return res.status(403).send();

    var uname = req.params.username || res.locals.decoded.username;

    User.findOne({ username: uname })
        .exec(function (err, user) {
            if (err) return next(err);

            Question.find({ answers: { $elemMatch: { user: user._id } } }, { __v: 0, })
                .populate({ path: 'user', select: 'username -_id' })
                .populate({ path: 'answers.user', select: 'username -_id' })
                .exec(function (err, questions) {
                    if (err) return next(err);

                    return res.status(200).json(questions);
                });
        });
});

router.get('/upvoteQuestion/:qid', function (req, res, next) {
    if (!res.locals || !res.locals.decoded)
        return res.status(403).send();

    Question.findOne({ _id: req.params.qid })
        .exec(function (err, question) {
            if (err) return next(err);

            if (!question)
                return res.status(409).send();

            if (!question.upvotedBy)
                question.upvotedBy = [res.locals.decoded._id];
            else if (question.upvotedBy.indexOf(res.locals.decoded._id) == -1)
                question.upvotedBy.push(res.locals.decoded._id);
            else
                return res.status(409).send();

            question.save(function (err) {
                if (err) next(err);

                return res.status(200).send();
            });
        });
});

router.get('/upvoteQuestionStatus/:qid', function (req, res, next) {
    if (!res.locals || !res.locals.decoded)
        return res.status(403).send();

    req.headers['if-none-match'] = '';

    Question.findOne({ _id: req.params.qid })
        .exec(function (err, question) {
            if (err) return next(err);

            if (!question)
                return res.status(409).send();

            if (!question.upvotedBy || question.upvotedBy.indexOf(res.locals.decoded._id) == -1)
                return res.send("False"); // user has not upvoted
            else
                return res.send("True");
        });
});

router.get('/upvoteAnswerStatus/:qid/:aid', function (req, res, next) {
    if (!res.locals || !res.locals.decoded)
        return res.status(403).send();

    Question.findOne({ _id: req.params.qid })
        .exec(function (err, question) {
            if (err) return next(err);

            if (!question)
                return res.status(409).send();

            var match = false;
            for (var i = 0; i < question.answers.length; ++i) {
                if (question.answers[i]._id == req.params.aid) {
                    match = true;

                    if (!question.answers[i].upvotedBy || question.answers[i].upvotedBy.indexOf(res.locals.decoded._id) == -1)
                        return res.send("False");
                    else
                        return res.send("True");
                }
            }

            if (match == false)
                return res.status(409).send();
        });
});

router.get('/upvoteAnswer/:qid/:aid', function (req, res, next) {
    if (!res.locals || !res.locals.decoded)
        return res.status(403).send();

    Question.findOne({ _id: req.params.qid })
        .exec(function (err, question) {
            if (err) return next(err);

            if (!question)
                return res.status(409).send();

            var match = false;
            for (var i = 0; i < question.answers.length; ++i) {
                if (question.answers[i]._id == req.params.aid) {
                    match = true;

                    if (!question.answers[i].upvotedBy)
                        question.answers[i].upvotedBy = [res.locals.decoded._id];
                    else if (question.answers[i].upvotedBy.indexOf(res.locals.decoded._id) == -1)
                        question.answers[i].upvotedBy.push(res.locals.decoded._id);
                    else
                        return res.status(409).send();
                }
            }

            if (match == false)
                return res.status(409).send();

            question.save(function (err) {
                if (err) next(err);

                return res.status(200).send();
            });
        });
});

module.exports = router;
