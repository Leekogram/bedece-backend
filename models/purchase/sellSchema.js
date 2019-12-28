const mongoose = require("mongoose");
const schema = mongoose.Schema;
const sellSchema = new schema({
    pay: {
        payCurrency: String,
        payAmount : Number
    },
    recieve: {
        recieveCurrency: String,
        recieveAmount : Number
    },
    transDetails: {
        creditAccount: String,
        refference: String
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
const sellModel = mongoose.model('sell', sellSchema);
module.exports = sellModel;