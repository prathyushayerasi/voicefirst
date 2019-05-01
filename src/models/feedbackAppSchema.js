const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const feedbackAppSchema = new Schema({
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
  description: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model(
  "feedbackApp",
  feedbackAppSchema,
  "feedbackApp"
);
