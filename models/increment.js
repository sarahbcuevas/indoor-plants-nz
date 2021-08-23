var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ModelIncrementSchema = new Schema({
    model: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    idx: {
        type: Number,
        default: 1000
    }
});

ModelIncrementSchema.statics.getNextId = async function(modelName, callback) {
    let incr = await this.findOne({ model: modelName });

    if (!incr) incr = await new this({ model: modelName }).save();
    incr.idx++;
    incr.save();
    return incr.idx;
}

var ModelIncrement = mongoose.model('ModelIncrement', ModelIncrementSchema);
module.exports = ModelIncrement;