const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let adminSchema = new Schema({
    email: {
        type: String
    },
    password: {
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
const adminModel = mongoose.model('adminModel', adminSchema)
module.exports = adminModel;