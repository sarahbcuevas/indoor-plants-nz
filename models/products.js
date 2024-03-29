var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Currency = mongoose.Types.Currency;

var photo = new Schema({
    url: {
        type: String,
        required: true
    },
    isPrimary: {
        type: Boolean,
        default: false
    }
});

var productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    description: {
        type: String,
        required: false
    },
    stock: {
        type: Number
    },
    price: {
        type: Number,
        required: true,
        get: getPrice,
        set: setPrice
    },
    deliveryFee: {
        type: Number,
        required: false,
        get: getPrice,
        set: setPrice
    },
    forPickupOnly: {
        type: Boolean
    },
    images: [photo],
    isBestseller: {
        type: Boolean
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

var Products = mongoose.model('Product', productSchema);
module.exports = Products;