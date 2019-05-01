const mongoose = require('mongoose');
const { Schema } = require('mongoose');

feedbackSchema = new Schema(
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
        description:{
            type:String,
            required:true
        }
    },
    {
        timestamps: true
    }
);

const CustomerFeedback = mongoose.model('CustomerFeedback', feedbackSchema);

module.exports = CustomerFeedback;
