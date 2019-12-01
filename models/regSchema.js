const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
let RegSchema = new Schema({
    userName : {
        type: String
    },
    email : {
        type : String
    },
    password : {
        type: {
            String: String
        }
    }
})
const RegModel = mongoose.model('RegModel', RegSchema)
module.exports = RegModel;