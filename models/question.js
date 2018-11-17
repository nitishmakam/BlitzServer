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
    },
});

answerSchema.virtual('upvotes').get(function () {
    return this.upvotedBy ? this.upvotedBy.length : 0;
});

answerSchema.set('toJSON', { getters: true, transform: function (doc, ret, options) {
    delete ret.upvotedBy;
}});

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
    },
});

questionSchema.virtual('upvotes').get(function () {
    return this.upvotedBy ? this.upvotedBy.length : 0;
});
    
questionSchema.set('toJSON', { getters: true, transform: function (doc, ret, options) {
    delete ret.upvotedBy;
}});

module.exports = mongoose.model('Question', questionSchema);
