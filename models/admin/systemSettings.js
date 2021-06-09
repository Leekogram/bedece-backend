const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let adminSchema = new Schema({
    create_admins: {
        type: Boolean,
        default: true
    },
    create_user:{
        type:Boolean,
        default: true
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