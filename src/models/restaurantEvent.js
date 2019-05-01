const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const restaurantEvent = new Schema(
  {
    restID: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true
    },
    eventName: {
      type: String,
      required: true
    },
    occasion: {
      type: String,
      required: true
    },
    dateEvent: {
      type: Date,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    entryFees: [
      {
        male: {
          type: Number,
          require: true
        },
        female: {
          type: Number,
          require: true
        },
        couple: {
          type: Number,
          require: true
        }
      }
    ],
    offers: {
      type: String
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String
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
const RestaurantEvent = mongoose.model("restaurantEvent", restaurantEvent);

module.exports = RestaurantEvent;
