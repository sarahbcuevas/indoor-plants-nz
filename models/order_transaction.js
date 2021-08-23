var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderTransactionSchema = new Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    summary: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

var OrderTransactions = mongoose.model('OrderTransaction', orderTransactionSchema);
module.exports = OrderTransactions;