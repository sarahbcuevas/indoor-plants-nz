var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contactSchema = new Schema({
    contactNo: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

var Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;