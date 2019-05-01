const Joi = require("joi");

function beenHereValidation(data) {
  var schema = {
    custID: Joi.string().required(),
    restID: Joi.string().required()
  };
  return Joi.validate(data, schema, { allowUnknown: true });
}

function reviewRatingValidation(data) {
  var schema = {
    custID: Joi.string().required(),
    restID: Joi.string().required(),
    rating: Joi.number()
      .max(5)
      .required(),
    reviewHeading: Joi.string(),
    description: Joi.string()
  };
  return Joi.validate(data, schema, { allowUnknown: true });
}

function bookMarksValidation(data) {
  var schema = {
    custID: Joi.string().required(),
    restID: Joi.string().required()
  };
  return Joi.validate(data, schema, { allowUnknown: true });
}

function orderPlaceValidatation(data) {
  var schema = {
    custID: Joi.string().required(),
    restID: Joi.string().required(),
    orderItems: Joi.array().required(),
    tableNo: Joi.number()
      .min(1)
      .required(),
    specialInstruction: Joi.string(),
    totalAmount: Joi.number().required()
  };
  return Joi.validate(data, schema, { allowUnknown: true });
}
// add to cart
function cartValidation(data) {
  // for sub documents validations
  const dishesItems = {
    dishID: Joi.string().required(),
    quantity: Joi.number().required(),
    // customisation: Joi.string()
  };
  var schema = {
    custID: Joi.string().required(),
    restID: Joi.string().required(),
    dishes: Joi.array()
      .items(Joi.object(dishesItems))
      .required(),
    specialInstruction: Joi.string().default("")
  };
  return Joi.validate(data, schema, { allowUnknown: true });
}


module.exports = {
  beenHereValidation,
  reviewRatingValidation,
  bookMarksValidation,
  orderPlaceValidatation,
  cartValidation
};
