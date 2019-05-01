const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const mexp = require("mongoose-elasticsearch-xp");

const restaurantSchema = new Schema(
  {
    uid: {
      type: String
    },
    adminId: {
      type: String, // objectID of admin
      ref: "RestAdmin"
    },
    name: {
      // restaurant name
      type: String,
      es_indexed: true
    },
    companyName: {
      //    Registered Business Name
      type: String
    },
    email: {
      // restaurants email id
      type: String
    },
    description: {
      type: String
    },
    phoneNo: {
      type: Number
    },
    profileImage: {
      type: String
    },
    restaurantType: {
      //       enum:['veg','nonveg','containsEgg'],
      type: String,
      es_indexed: true
    },
    restaurantRating: {
      rating: {
        type: Number,
        es_indexed: true
      },
      count: {
        type: Number
      }
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    oAuth: {
      type: Boolean,
      required: true
    },
    oAuthProvider: {
      type: String,
      required: true
    },
    isDeleted: {
      type: Boolean
    },
    geoLocation: {
      type: {
        type: String
      },
      coordinates: {
        type: [Number]
      }
    },
    employees: {
      type: Array
    },
    restaurantAddress: {
      address: {
        type: String,
        es_indexed: true
      },
      locality: {
        type: String,
        es_indexed: true
      },
      pincode: {
        type: Number
      },
      city: {
        type: String,
        es_indexed: true
      },
      state: {
        type: String
      },
      country: {
        type: String
      }
    },
    images: [
      {
        image: {
          // ambience of restaurant
          type: String
        },
        type: {
          //scanned copy of menu
          type: String
        }
      }
    ],
    cuisine:
      // chinese , indian , american
      {
        type: Array,
        es_indexed: true
      },
    tags:
      // free parking , live music , wifi
      {
        type: Array,
        es_indexed: true
      },
    alcohol: {
      type: Boolean
    },
    isHygiene:{
      type:Boolean
    },
    services:
      // Microbrewery , cafe .
      {
        type: Array,
        es_indexed: true
      },
    packingCharge: {
      type: Number
    },
    seating: {
      type: Boolean // enum:['availble','not availble'],
    },
    paymentModes: {
      // enum:["card", "cash", "wallet"],
      type: Array
    },
    operatingDays: {
      //  name of weeks
      type: Array // Key value pair Array Sunday -> 10:00 AM to 10:00 PM
    },
    panNo: {
      // TAN number required if registered as company
      type: String,
      trim: true
    },
    panCopy: {
      // TAN number required if registered as company
      type: String
    },
    fssaiCertificate: {
      type: Boolean
    },
    gstin: {
      type: String
    },
    gst: {
      type: String
    },
    ServiceFee: {
      type: Number
    },
    invoiceProof: {
      // Should contain details of all fees charged (including Taxes, Service fee, Delivery fee, Packaging charges))
      type: String
    },
    accountNumber: {
      // bank account detail of restaurants owner's
      type: String
    },
    ifscCode: {
      type: String
    },
    browser: {
      type: String
      // es_indexed: true
    },
    lastLoggedIn: {
      type: Date
      // es_indexed: true
    }
  },
  {
    timestamps: true
  }
);

restaurantSchema.methods.joiValidateAdmin = data => {
  const Joi = require("joi");
  var schema = {
    name: Joi.string().required(),
    adminId: Joi.string().required(),
    email: Joi.string()
      .email({ minDomainAtoms: 2 })
      .required()
  };
  return Joi.validate(data, schema, { allowUnknown: true });
};

restaurantSchema.plugin(mexp);
restaurantSchema.index({ geoLocation: "2dsphere" });
const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
