const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const restAdminSchema = new Schema({
  uid: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    minlength: [6, "email should be more than 6 characters"]
  },
  username: {
    type: String
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "password should be more than or equal to 8 characters"]
  },
  passwordKey: {
    type: String,
    required: true
  },
  phoneNo: {
    type: Number
  },
  profileImage: {
    type: String,
    required: true
  },
  restID: [{
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
  }],
  role: {
    type: String,
    enum: ["admin", "manager", "chef"],
    required: true
  },
  browser: {
    type: String,
    es_indexed: true
  },
  device: {
    type: String,
    es_indexed: true
  },
  lastLoggedIn: {
    type: Date,
    es_indexed: true
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false
  },
  createdAt: {
    type: Date,
  },
  isDeleted: {
    type: Boolean,
    default: false,
    required: true
  },
});

restAdminSchema.methods.joiValidate = data => {
  const Joi = require("joi");
  var schema = {
    name: Joi.string(),
    email: Joi.string().email({ minDomainAtoms: 2 }),
    phoneNo: Joi.number()
      .min(1000000000)
      .max(99999999999999),
    profileImage: Joi.string()
  };
  return Joi.validate(data, schema, { allowUnknown: true });
};

module.exports = mongoose.model("restAdmin", restAdminSchema, "restAdmin");
