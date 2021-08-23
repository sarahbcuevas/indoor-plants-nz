var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ModelIncrement = require('./increment');

var orderDiscount = new Schema({
    discount: {
        type: Number,
        required: true
    },
    mode: {
        type: String,
        required: true
    },
    reason: {
        type: String
    }
});

var orderItem = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

var shippingDetails = new Schema({
    mode: {
        type: String,
        required: true
    },
    fee: {
        type: Number,
        required: true
    },
    customName: {
        type: String
    }
});

var orderSchema = new Schema({
    code: {
        type: Number,
        default: 1000
    },
    customer: {
        // This can be a saved customer id or a Customer object
        type: mongoose.Schema.Types.Mixed
    },
    orderStatus: {
        type: String,
        default: 'Open'
    },
    paymentStatus: {
        type: String,
        default: 'Pending'
    },
    fulfillmentStatus: {
        type: String,
        default: 'Unfulfilled'
    },
    shipping: shippingDetails,
    paymentMethod: {
        type: String,
        default: 'Cash'
    },
    orderItems: [orderItem],
    tags: [{
        type: String
    }],
    notes: {
        type: String
    },
    discount: orderDiscount,
    total: {
        type: Number,
        required: true
    },
    trackingUrl: {
        type: String
    }
}, {
    timestamps: true
});

orderSchema.pre('save', async function(next) {
    if (this.isNew) {
        const code = await ModelIncrement.getNextId('Order');
        this.code = code;
        next();
    } else {
        next();
    }
});

var Orders = mongoose.model('Order', orderSchema);
module.exports = Orders;