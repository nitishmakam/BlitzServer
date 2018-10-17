var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    dob: Date,
});

module.exports = mongoose.model('User', userSchema);
