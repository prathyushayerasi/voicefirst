const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const cart = new Schema(
  {
    restID: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true
    },
    custID: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },
    dishes: [
      {
        dishID: {
          type: Schema.Types.ObjectId,
          ref: "Dish",
          required: true
        },
        quantity: {
          type: Number,
          require: true
        },
        price: {
          type: Number
        },
        totalPrice: {
          type: Number
        }
      }
    ],
    specialInstruction: {
      type: String
    },
    totalCartPrice: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

const Cart = mongoose.model("cart", cart, "cart");

module.exports = Cart;
