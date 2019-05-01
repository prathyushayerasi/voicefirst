const mongoose = require('mongoose');
const { Schema } = require('mongoose');

 const reportSchema = new Schema(
    {
        uid: {
            type: String,
            required: true
        },
        custID: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },
        title:{
            type:String,
            required:true
        },
        reportImage:{
            type:String
        },
        description:{
            type:String,
            required:true
        }
    },
    {
        timestamps: true
    }
);

const CustomerReport = mongoose.model('CustomerReport', reportSchema);

module.exports = CustomerReport;
