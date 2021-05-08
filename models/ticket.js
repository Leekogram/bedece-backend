const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let TicketSchema = new Schema({
    subject: {
        type: String
    },
    priority: {
        type: String, enum: ["Low", "Medium", "High"], required: [true, "Has to be either one of these enum values: Low, Medium, High"]
    },
    type: {
        type: String, enum: ["Technical", "Account"], required: [true, "Has to be either one of these enum values: Technical, Account"]
    },
    message: {
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
const TicketModel = mongoose.model('TicketModel', TicketSchema)
module.exports = TicketModel;