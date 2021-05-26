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