const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const mexp = require("mongoose-elasticsearch-xp");

dishesSchema = new Schema(
  {
    uid: {
      type: String,
      required: true
    },
    restID: {
      type: Schema.Types.ObjectId,
      required: true
    },
    name: {
      type: String,
      required: true,
      es_indexed: true
    },
    category: { // Main course etc.
      type: String,
      required: true,
      es_indexed: true
    },
    isPopular: {
      type: Boolean,
      default: false
    },
    type: { // Veg/Non-Veg/Egg
      type: String,
      required: true
    },
    customisations: {
      type: String,
    },
    cuision: {
      type: String,
    },
    nutritions: { //calories protein fat carbs
      type: String
    },
    description: {
      type: String
    },
    price: {
      type: Number,
      required:true
    },
    image: {
      type: String
    },
    code: {
      type: String
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  {
    timestamps: true
  }
);

dishesSchema.plugin(mexp);
const Dishes = mongoose.model('Dish', dishesSchema);

module.exports = Dishes;
