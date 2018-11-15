var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var socialMediaSchema = new Schema({
    facebook: {
        type: String,
        required: false
    },
    instagram: {
        type: String,
        required: false
    },
    trademe: {
        type: String,
        required: false
    },
    twitter: {
        type: String,
        required: false
    },
    youtube: {
        type: String,
        required: false
    }
});

var SocialMedia = mongoose.model('SocialMedia', socialMediaSchema);
module.exports = SocialMedia;