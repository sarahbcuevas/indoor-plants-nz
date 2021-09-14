var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var item = new Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    url: {
        type: String
    },
    action: {
        type: String
    }
});

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
    slideshow: [item],
    footerDescription: {
        type: String,
        required: true
    }
});

var Content = mongoose.model('Content', contentSchema);
module.exports = Content;