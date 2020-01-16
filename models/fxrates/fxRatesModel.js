const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let RateSchema = new Schema({
    currency: {
        type: String
    },
    rateToNaira: {
        type: String,
        default: 1
    },
    created_date: {
        type: Date,
        default: Date.now,
        once: true
    },
    updated: {
        type: Date,
        default: Date.now,

    }
})
const RateModel = mongoose.model('RateModel', RateSchema)
module.exports = RateModel;