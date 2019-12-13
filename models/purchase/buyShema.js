const mongoose = require("mongoose");
const schema = mongoose.Schema;
const buySchema = new schema({
    currency: {
        type: String
    },
    units: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId
        //this is the id of the person making the purchase
    },
    transactionId: {
        type: String
    },
    isDelivered: {
        type: Boolean
    },
    deliveryMethod: {
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
const buyModel = mongoose.model('buy', buySchema);
module.exports = buyModel;