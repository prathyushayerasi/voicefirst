const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const beenHereSchema = new Schema(
  {
    custID: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },
    restID: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const beenHere = mongoose.model("beenHere", beenHereSchema, "beenHere");
module.exports = beenHere;
