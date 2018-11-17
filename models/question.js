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
    upvotedBy: {
        type: [Schema.ObjectId],
        default: undefined,
        select: false,
    },
});

answerSchema.virtual('upvotes').get(function () {
    return this.upvotedBy ? this.upvotedBy.length : 0;
});

answerSchema.set('toObject', { virtuals: true, });
answerSchema.set('toJSON', { virtuals: true, });

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
    upvotedBy: {
        type: [Schema.ObjectId],
        default: undefined,
        select: false,
    },
});

questionSchema.virtual('upvotes').get(function () {
    console.log(this.upvotedBy);
    return (this.upvotedBy != undefined ? this.upvotedBy.length : 0);
});
    
questionSchema.set('toObject', { virtuals: true, });
questionSchema.set('toJSON', { virtuals: true, });

module.exports = mongoose.model('Question', questionSchema);
