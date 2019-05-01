const mongoose = require('mongoose');
const { Schema } = require('mongoose');

otpSchema = new Schema(
    {
        phoneNo: {
            type: Number,
            required: true
        },
        otp: {
            type: Number,
            required: true
        },
        time: {
            type: String,
            required: true
        },
        count: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;
