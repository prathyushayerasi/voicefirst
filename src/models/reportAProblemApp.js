const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const reportAProblemAppSchema = new Schema({
  uid: {
    type: String,
    required: true
  },
  custID: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },
  version: {
    type: String,
    required: true
  },
  images: {
    type: Array
  },
  description: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model(
  "reportAProblemApp",
  reportAProblemAppSchema,
  "reportAProblemApp"
);
