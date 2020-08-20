const mongoose = require("mongoose");
const schema = mongoose.Schema;
let customId = mongoose.Types.ObjectId()

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
        // please, these feilds are populated from the reg schema
        // you get the users bank details from eg. https://bcd-backend.herokuapp.com/reg/user-bank/5e0ead95e49b090017f758ec
        creditAccount: {
            bcdAccountName:String,
            bcdAccountNumber: String,
            bcdBankName: String
        },
        debitAccount: {
            clientAccountName:String,
            clientAccountNumber: String,
            clientBankName: String
        },
        refference: {
            type:String,
            // default:`BDC/${new Date().toLocaleDateString()}/${customId}`,
            // once:true
        }
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId
        //this is the id of the person making the purchase
    },
    user:{
        fname:"",
        lname:"",
        email:"",
        phone:""
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
});
const sellModel = mongoose.model('sell', sellSchema);
module.exports = sellModel;