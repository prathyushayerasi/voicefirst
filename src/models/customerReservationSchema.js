const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const customerReservation = new Schema(
  {
    restID: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true
    },
    customerName: {
      type: String,
      required: true
    },
    phoneNo: {
      type: Number,
      required: true
    },
    email: {
      type: String,
      lowercase: true
    },
    reserveDate: {
      type: Date,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    occasion: {
      type: String
    },
    guestCount: {
      type: Number,
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
const CustomerReservation = mongoose.model(
  "CustomerReservation",
  customerReservation
);

module.exports = CustomerReservation;
