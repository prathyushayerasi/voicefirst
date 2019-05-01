const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const customerReviews = new Schema(
  {
    custID: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },
    restID: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      require: true
    },
    rating: {
      type: Number,
      required: true,
      max: 5
    },
    reviewHeading: {
      type: String,
      default:""
    },
    description: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: Date.now
    },
    restaurantResponse: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const CustomerReviews = mongoose.model(
  "customerReviews",
  customerReviews,
  "customerReviews"
);
module.exports = CustomerReviews;
