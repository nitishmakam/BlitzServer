var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var answerSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

var questionSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    created: {
        type: Date,
        default: Date.now,
    },
    answers: {
        type: [answerSchema],
        default: undefined,
    },
    
});

module.exports = mongoose.model('Question', questionSchema);
