var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    name: {
        type: String,
        default: ''
    },
    email: {
        type: String
    },
    contact: {
        type: String
    },
    address: {
        type: String
    },
    role: {
        type: String,        // options: admin, user
        default: 'admin'
    }
}, {
    timestamps: true
});

userSchema.plugin(passportLocalMongoose);

var Users = mongoose.model('User', userSchema);
module.exports = Users;