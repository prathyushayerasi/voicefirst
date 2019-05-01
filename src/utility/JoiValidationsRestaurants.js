const Joi = require("joi");

function joiValidateRestDetails(data) {  
    var schema = {
      companyName: Joi.string()
        .min(3)
        .required(), //  Registered Business Name
      phoneNo: Joi.number()
        .min(1000000000)
        .max(99999999999999)
        .required(),
      profileImage: Joi.string(),
      description: Joi.string().max(120),
      ambience: Joi.string(),
      PackingCharge: Joi.number(),
      seating: Joi.boolean(),
      restaurantType: Joi.string().max(30),
      paymentMode: Joi.array().required(),
      operatingDays: Joi.array().required(),
      panNo: Joi.string()
        .alphanum()
        .regex(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/),
      services: Joi.array().required(),
    };
    return Joi.validate(data, schema, { allowUnknown: true });
  }


function promocodeValidation(data) {
  var schema = {
    restID: Joi.string().required(),
    code: Joi.string()
      .min(5)
      .required(),
    discount: Joi.number()
      .max(100)
      .required(),
    maxDiscount: Joi.number().required(),
    startDate: Joi.date().required(),
    expiryDate: Joi.date().required()
  };
  return Joi.validate(data, schema, { allowUnknown: true });
}

// restaurants side responce valdation
function responseValidation(data) {
  var schema = {
    custID: Joi.string().required(),
    restID: Joi.string().required(),
    restaurantResponse: Joi.string().required()
  };
  return Joi.validate(data, schema, { allowUnknown: true });
}

function addReservationValidation(data) {
  var schema = {
    restID: Joi.string().required(),
    customerName: Joi.string()
      .min(3)
      .required(),
    phoneNo: Joi.number()
      .min(1000000000)
      .max(99999999999999)
      .required(),
    email: Joi.string().email({ minDomainAtoms: 2 }),
    reserveDate: Joi.date().required(),
    time: Joi.string().required(),
    occasion: Joi.string().required(),
    guestCount: Joi.number().required()
  };
  return Joi.validate(data, schema, { allowUnknown: true });
}

// add restaurant events validations
function restaurantsEvents(data) {
  var schemafees = {
    male: Joi.number().required(),
    female: Joi.number().required(),
    couple: Joi.number().required()
  };
  var schema = {
    restID: Joi.string().required(),
    eventName: Joi.string()
      .min(3)
      .required(),
    occasion: Joi.string()
      .min(3)
      .required(),
    dateEvent: Joi.date().required(),
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
    description: Joi.string()
      .min(10)
      .required(),
    entryFees: Joi.array()
      .items(Joi.object(schemafees))
      .required()
  };
  return Joi.validate(data, schema, { allowUnknown: true });
}

function menuValidation(data) {
  var schema = {
    restID: Joi.string().required(),
    name: Joi.string()
      .min(3)
      .required(),
    category: Joi.string()
      .min(3)
      .required(),
    type: Joi.string()
      .min(3)
      .required(),
    price: Joi.number().required(),
    isPopular: Joi.boolean().required(),
    code: Joi.string().min(3).max(6)
  };
  return Joi.validate(data, schema, { allowUnknown: true });
}

function todoValidation(data) {
  var schema = {
    restAdminID: Joi.string().required(),
    todoText: Joi.string().required()
  };
  return Joi.validate(data, schema, { allowUnknown: true });
}

module.exports = {
  joiValidateRestDetails,
  promocodeValidation,
  responseValidation,
  addReservationValidation,
  restaurantsEvents,
  menuValidation,
  todoValidation
};