const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let customId = mongoose.Types.ObjectId()
let TransSchema = new Schema({
    Type: {
        type: String,
        once: true
    },
    pay: {
        payCurrency: String,
        payAmount : Number
    },
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
        refference: {
            type: String,
            default: `BCD/${new Date().toLocaleDateString()}/${customId}`,
            once: true
        }
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId
        //this is the id of the person making the purchase
    },
    user: {
        fname: "",
        lname: "",
        email: "",
        phone: ""
    },
    transactionId: {
        type: mongoose.Schema.Types.ObjectId
        // this is the generated transaction id 
    },

    status: {
        type: String,
        default: "pending"
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


})
TransSchema.index({'$**': 'text'})
const TransModel = mongoose.model('TransModel', TransSchema)
module.exports = TransModel;