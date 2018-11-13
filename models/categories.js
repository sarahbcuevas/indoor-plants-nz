var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    }
}, {
    timestamps: true
});

var Categories = mongoose.model('Category', categorySchema);
module.exports = Categories;