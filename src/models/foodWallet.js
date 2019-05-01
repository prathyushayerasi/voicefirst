const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const foodWalletSchema = new Schema({
  custID: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },
  senderID: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },
  restID: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  },
  dishItems: [
    {
      dishID: {
        type: Schema.Types.ObjectId,
        ref: "Dishes",
        required: true
      },
      quantity: {
        type: Number,
        require: true,
        default: 1
      }
    },
    {
      require: true
    }
  ],
  expiresAt: {
      type: Date,
      required: true
  }
});

const FoodWallet = mongoose.model('foodwallet', foodWalletSchema);
module.exports = FoodWallet;