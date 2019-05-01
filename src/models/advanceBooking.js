const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const advanceBooking = new Schema(
    {
        name:{
            type:String,
            require:true
        },
        custID: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            required: true
          },
        restID: {
            type: Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true
          },
        phoneNo: {
            type: Number,
            required: true
        },
        date:{
            type:String,
            required:true
        },
        time:{
            type:String,
            required:true
        },
        person:{
            type:Number,
            required:true
        },
        status:{   //  confirm or pending by manager
            type:Boolean,
            default:false
        },
        description: {   //  optaional 
            type: String,
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

const AdvanceBooking = mongoose.model('AdvanceBooking', advanceBooking);

module.exports = AdvanceBooking;
