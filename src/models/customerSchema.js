const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const customerSchema = new Schema(
  {
    uid: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
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
      minlength: [6, "password should be more than 6 characters"]
    },
    passwordKey: {
      type: String,
      required: true
    },
    phoneNo: {
      type: Number,
      default: false
    },
    profileImage: {
      type: String,
      required: true
    },
    customerType: {
      type: String
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true
    },
    oAuth: {
      type: Boolean,
      es_indexed: true,
      required: true
    },
    oAuthProvider: {
      type: String,
      es_indexed: true,
      required: true
    },
    linkedAccounts: {
      type: Array,
      es_indexed: true
    },
    linkedAccountEmails: {
      type: Array, //[strategy]: email strategy can be facebook and google
      es_indexed: true
    },
    loyaltyPoints: {
      type: Number
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true
    },
    // location: {
    //   city: {
    //     type: String,
    //     es_indexed: true
    //   },
    //   region: {
    //     type: String,
    //     es_indexed: true
    //   },
    //   country: {
    //     type: String,
    //     es_indexed: true
    //   },
    //   timezone: {
    //     type: String,
    //     es_indexed: true
    //   },
    //   isp: {
    //     type: String,
    //     es_indexed: true
    //   },
    //   countryCode: {
    //     type: String,
    //     es_indexed: true
    //   },
    //   coordinates: {
    //     lat: {
    //       type: Number,
    //       es_indexed: true,
    //     },
    //     lon: {
    //       type: Number,
    //       es_indexed: true,
    //     }
    //   },
    //   ip: {
    //     type: String,
    //     es_indexed: true
    //   }
    // },
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
    createdAt: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

customerSchema.methods.joiValidate = data => {
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

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
