var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);

var Currency = mongoose.Types.Currency;

var productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    description: {
        type: String,
        required: false
    },
    price: {
        type: Currency,
        required: true,
        get: getPrice
    },
    deliveryFee: {
        type: Currency,
        required: false,
        get: getPrice
    },
    forPickupOnly: {
        type: Boolean
    },
    image: {
        type: String,
        required: false
    },
    isBestseller: {
        type: Boolean
    },
    isSoldout: {
        type: Boolean
    }
}, {
    timestamps: true
});

function getPrice(num) {
    return (num/100).toFixed(2);
}

var Products = mongoose.model('Product', productSchema);
module.exports = Products;