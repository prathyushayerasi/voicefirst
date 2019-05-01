const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const bookMarks = new Schema(
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
      default: false,
      required: true
    }
  },
  {
    timestamps: true
  }
);
const BookMarks = mongoose.model("bookMarks", bookMarks, "bookMarks");

module.exports = BookMarks;
