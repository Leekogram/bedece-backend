const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let adminSchema = new Schema(
  {
    fname: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    lname: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },

    rank: {
      type: String,
      enum: ["SUPERADMIN", "ADMIN"],
      required: [
        true,
        "Has to be either one of these enum values: SUPERADMIN, ADMIN",
      ],
    },

    created_date: {
      type: Date,
      default: Date.now,
      once: true,
    },
    updated: {
      type: Date,
      default: Date.now,
    },
  },
  { strict: false }
);
const adminModel = mongoose.model("adminModel", adminSchema);
module.exports = adminModel;
