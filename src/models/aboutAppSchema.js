const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const aboutAppSchema = new Schema(
    {
        uid: {
            type: String,
            required: true
        },
        version: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    }
);

module.exports = mongoose.model("aboutApp", aboutAppSchema, "aboutApp");