const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let RegSchema = new Schema({
    fullName: {
        type: String
    },
    address: {
        type: String
    },
    accountNumber: {
        type: Number
    },
    accountName: {
        type: String
    },
    bankName: {
        type: String
    },
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
    organisation: {
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