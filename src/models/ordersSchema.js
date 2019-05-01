const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const orderSchema = new Schema(
  {
    restID: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true
    },
    cartID: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
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
          type: Number,
          require: true
        },
        price: {
          type: Number
        },
        totalPrice: {
          type: Number
        }
      },
      {
        require: true
      }
    ],
    tableNo: {
      type: Number,
      required: true
    },
    specialInstruction: {
      type: String,
      default: ""
    },
    totalAmount: {
      type: Number,
      require: true
    },
    offerApplied: {
      type: String
    },
    offerDiscount: {
      type: Number
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "cash"]
    },
    orderStatus: {
      type: String,
      enum: ['awaited', 'confirmed', 'preparing', 'completed']
    },
    estimatedTime:{
      type:String
    }
  },
  {
    timestamps: true
  }
);

const Orders = mongoose.model("orders", orderSchema, "orders");

module.exports = Orders;
