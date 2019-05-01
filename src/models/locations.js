const mongoose = require('mongoose');
const { Schema } = require('mongoose');

locationSchema = new Schema(
  {
    locationID: {
      type: String,
      required: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  },
  {
    timestamps: true
  }
);

const Locations = mongoose.model('location', locationSchema);

module.exports = Locations;
