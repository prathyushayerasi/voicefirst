const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const toDoList = new Schema({
    restAdminID: {
        type:Schema.Types.ObjectId,
        ref:"RestAdmin",
        required: true
    },
    todoText: {
        type: String,
        required: true
    },
    IsCompleted: {
        type: Boolean,
        default: false
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

const todoText = mongoose.model("toDoList", toDoList);
module.exports = todoText;