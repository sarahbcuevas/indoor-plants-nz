var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Product = require('./products');

var orderItem = new Schema({
    product: {
        type: mongoose.Schema.Types.Mixed
    },
    quantity: {
        type: Number,
        required: true
    }
});

var orderSchema = new Schema({
    customer: {
        // This can be a saved customer id or a Customer object
        type: mongoose.Schema.Types.Mixed
    },
    status: {
        type: String,
        default: 'Pending'
    },
    forShipping: {
        type: Boolean
    },
    shippingFee: {
        type: Number
    },
    paymentMethod: {
        type: String,
        default: 'Cash'
    },
    orderItems: [orderItem]
}, {
    timestamps: true
});


var Orders = mongoose.model('Order', orderSchema);
module.exports = Orders;