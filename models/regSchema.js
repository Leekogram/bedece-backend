const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let RegSchema = new Schema({
    fname: {
        type: String
    },
    lname: {
        type: String
    },
    email: {
        type: String
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    country: {
        type: String
    },
    image: {
        type: String
    },
    bank: [{
        accountNumber: {
            type: Number
        },
        accountName: {
            type: String
        },
        bankName: {
            type: String
        }
    }],
    Dob: {
        type: Date
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String

    },
    acctType: {
        type: String
        //for corporate or individual
    },
    rcNumber: {
        type: String
        //for corporate or individual
    },
    busPhoneNum: {
        type: String
        //for corporate or individual
    },
    busEmail: {
        type: String
        //for corporate or individual
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
const RegModel = mongoose.model('RegModel', RegSchema)
module.exports = RegModel;