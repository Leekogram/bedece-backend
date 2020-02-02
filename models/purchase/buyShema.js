const mongoose = require("mongoose");
const schema = mongoose.Schema;
const buySchema = new schema({
    give: {
        giveCurrency: String,
        giveAmount: String
    },
    recieve: {
        recieveCurrency: String,
        recieveAmount: Number
    },
    transDetails: {
        // please, these feilds are populated from the reg schema
        // you get the users bank details from eg. https://bcd-backend.herokuapp.com/reg/user-bank/5e0ead95e49b090017f758ec
        creditAccount: {
            bcdAccountName: String,
            bcdAccountNumber: String,
            bcdBankName: String
        },
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
const buyModel = mongoose.model('buy', buySchema);
module.exports = buyModel;