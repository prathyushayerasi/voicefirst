const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const promocode = new Schema(
    {
        restID: {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true
        },
        code: {
            type: String,
            uppercase: true,
            required: true
        },
        discount: {
            type: Number,
            max: 100,
            required: [true, '% of discount']
        },
        maxDiscount: {
            type: Number,
            required: [true, 'Rs max to discount']
        },
        cashback: {
            type: Number,
            default: 0
        },
        applicable: {
            type: Boolean,
            default: true
        },
        startDate: {
            type: Date,
            required: true
        },
        expiryDate: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Promocode = mongoose.model('Promocode', promocode);

module.exports = Promocode;
