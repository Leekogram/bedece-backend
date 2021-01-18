const mongoose = require("mongoose");
const schema = mongoose.Schema;
let customId = mongoose.Types.ObjectId()
// autoIncrement = require('mongoose-auto-increment');
let gen = require ("../utility/referenceGenerator")
// var connection = mongoose.createConnection("mongodb://localhost/test");
// autoIncrement.initialize(connection);



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
        refference: {
            type:String,
            // default:`${myTime}${day}${month}${year}313BDC${month}${customId}`,
            default:gen,

            once:true
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
    // transactionId: {
    //     type: mongoose.Schema.Types.ObjectId
    //     // this is the generated transaction id 
    // },

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
// buySchema.plugin(autoIncrement.plugin,  { model: 'Book', field: 'bookId' });

// buyModel.get('/all-buys', (req, res) => {
//     Buyer.find((err, result) => {
//       if (err) res.send(err)
//       res.send(result)
//     })
//   })


const buyModel = mongoose.model('buy', buySchema);
module.exports = buyModel;