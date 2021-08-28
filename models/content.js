var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contentSchema = new Schema({
    shopName: {
        type: String,
        required: true
    },
    shopSubtitle: {
        type: String,
        required: true
    },
    topBarContent: {
        type: String,
        required: false
    },
    jumbotronImage: {
        type: String,
        required: false
    },
    jumbotronTitle: {
        type: String,
        required: false
    },
    jumbotronDescription: {
        type: String,
        required: false
    },
    footerDescription: {
        type: String,
        required: true
    }
});

var Content = mongoose.model('Content', contentSchema);
module.exports = Content;