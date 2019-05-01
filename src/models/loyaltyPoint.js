const mongoose = require('mongoose');
const { Schema } = require('mongoose');

loyaltyPointsSchema = new Schema(
    {
        uid: {
            type: String,
            required: true
        },
        orderID:{
            type:Schema.Types.ObjectId,
            ref:"Orders",
            required:true
        },
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
        point:{
            type:Number,
            required:true
        },
        createdAt:{
            type: Date
        }
    },
    {
        timestamps: true
    }
);

const LoyaltyPoint = mongoose.model('LoyaltyPoint', loyaltyPointsSchema);

module.exports = LoyaltyPoint;
