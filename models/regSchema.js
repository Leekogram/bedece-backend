const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let RegSchema = new Schema({
    fname: {
        type: String
    },
    active:{
        type:Boolean,
        default: true
    },
    lname: {
        type: String
    },
    userName: {
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
    logged_in: {
        type: Boolean, default: false
    },
    bank: [{
        accountNumber: {
            type: String
        },
        accountName: {
            type: String
        },
        bankName: {
            type: String
        },
        currencyType: {
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
    aboutMe: {
        type: String
    },
    logout_time:{
         type: Date
    },
    login_time:{
        type: Date
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
RegSchema.index({'$**': 'text'})
const RegModel = mongoose.model('RegModel', RegSchema)
module.exports = RegModel;