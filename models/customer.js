var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var customerSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String
    },
    contact: {
        type: String
    },
    country: {
        type: String
    },
    region: {
        type: String
    },
    city: {
        type: String
    },
    address: {
        type: String
    },
    postal: {
        type: String
    }
}, {
    timestamps: true
});


var Customers = mongoose.model('Customer', customerSchema);
module.exports = Customers;