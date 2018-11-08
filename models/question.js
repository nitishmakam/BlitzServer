var mongoose = require('mongoose');

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
    answers: {
        type: [answerSchema],
        default: undefined,
    },
    
});

module.exports = mongoose.model('Question', questionSchema);
