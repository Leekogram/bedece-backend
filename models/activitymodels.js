const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let ActivitySchema = new Schema({
    activity: {
        type: String
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "RegModel",
        required: [true, "User id is needed, i.e the sender"]
    },
    status: {
        type: String, enum: ["Technical", "Account"], required: [true, "Has to be either one of these enum values: Technical, Account"]
    },
    message: [{
        sender: {
            type: String, enum: ["admin", "user"], required: [true, "Please add the sender details - Must be of enum [admin or user]"]
        },
        comment: {
            type: String
        },
       
    }],
    userId: {
        type: Schema.Types.ObjectId,
        ref: "RegModel",
        required: [true, "User id is needed, i.e the sender"]
    },
    active: {
        type: Boolean, default: true
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
const ActivityModel = mongoose.model('ActivityModel', ActivitySchema)
module.exports = ActivityModel;