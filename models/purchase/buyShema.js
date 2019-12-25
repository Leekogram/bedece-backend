const mongoose = require("mongoose");
const schema = mongoose.Schema;
const buySchema = new schema({
    currency: {
        type: String
    },
    units: {
        type: Number
    },
    estimatedValue: {
        type: Number
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId
        //this is the id of the person making the purchase
    },
    transactionId: {
        type: mongoose.Schema.Types.ObjectId
        // this is the generated transaction id 
    },
   
    isDelivered: {
        type: Boolean,
        default: false
    },
    deliveryMethod: {
        type: String
    },
    deliveryAddress: {
        type: String
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
});
const buyModel = mongoose.model('buy', buySchema);
module.exports = buyModel;