var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var settingSchema = new Schema({
    allowPickup: {
        type: Boolean,
        default: false
    },
    northIslandShippingRate: {
        type: Number,
        default: 0,
        get: getPrice,
        set: setPrice
    },
    southIslandShippingRate: {
        type: Number,
        default: 0,
        get: getPrice,
        set: setPrice
    },
    acceptCash: {
        type: Boolean,
        default: false
    },
    acceptPaypal: {
        type: Boolean,
        default: false
    },
    acceptLaybuy: {
        type: Boolean,
        default: false
    }, 
    acceptGenopay: {
        type: Boolean,
        default: false
    },
    acceptApplepay: {
        type: Boolean,
        default: false
    },
    acceptAfterpay: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

function getPrice(num) {
    return (num/100).toFixed(2);
}

function setPrice(num) {
    return num*100;
}

var Settings = mongoose.model('Settings', settingSchema);
module.exports = Settings;