const Pid = require("puid");
const bcrypt = require("bcryptjs");
const puid = new Pid();
const db = require("../models/index");
const jwtAuth = require("../utility/jwtAuth");
const MESSAGE = require("../utility/messages");
const mongoose = require('mongoose');
const randomstring = require("randomstring");
const moment = require("moment");
const JoiValidate = require("../utility/JoiValidationsRestaurants");
const AWS = require("aws-sdk");
const mailer = require("../utility/mailer");
const jwt = require("jsonwebtoken");
const awsconfig = require("../config/aws-config");
AWS.config.update(awsconfig);
const jwtSecret = process.env.JWT_SECRET;

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const returnData = require('../utility/returnRestProfiles');

const userProfile = user => ({
  name: user.name,
  email: user.email,
  uid: user.uid,
  phontNo: user.phontNo,
  introShown: user.introShown,
  username: user.username,
  type: user.restaurantType,
  profileImage: user.profileImage,
  oAuth: user.oAuth,
  oAuthProvider: user.oAuthProvider,
  lastLoggedIn: user.lastLoggedIn,
  createdAt: user.createdAt
});

const RestaurantController = {};

//Not in Use
RestaurantController.register = (req, res) => {
  const {
    name,
    email,
    password,
    phoneNo,
    companyName,
    restaurantType,
    location,
    device,
    browser
  } = req.body;
  let Email = email; // .toLowerCase();
  let uid = puid.generate();
  const Restaurant = new db.Restaurant({
    uid,
    name,
    companyName,
    email: Email,
    password,
    phoneNo,
    restaurantType,
    oAuth: false,
    oAuthProvider: "voicefirst",
    lastLoggedIn: new Date(),
    createdAt: new Date(),
    device,
    location,
    "geoLocation.type": "Point",
    "geoLocation.coordinates": req.body.geoLocation,
    browser
  });
  db.Restaurant.findOne({ email: Email }, (err, usr) => {
    if (err) {
      res.status(500).json(MESSAGE.DATABASE_ERROR);
    } else {
      if (usr == null) {
        bcrypt.genSalt(function(err, salt) {
          bcrypt.hash(Restaurant.password, salt, function(err, hash) {
            Restaurant.password = hash;
            Restaurant.profileImage = "hello";
            //   DEFAULT_PROFILE_IMAGES[Math.floor(Math.random() * 2)];
            Restaurant.save((err, data) => {
              if (err) {
                res.status(500).json({ err });
              }
              let token = jwtAuth.createJWToken({
                sessionData: { username: data.email }
              });
              res.status(200).json({
                message: "Successfully Registered",
                user: userProfile(data),
                token_value: {
                  access_token: token
                }
              });
              // add Subscriber to updates
              // addSubscriber({ Name: name }, email);
            });
          });
        });
      } else {
        res.status(400).json(MESSAGE.USER_EXISTS);
      }
    }
  });
};

//Not in Use
RestaurantController.login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const version = req.body.version;
  //   let Email=email.toLowerCase();
  db.Restaurant.findOneAndUpdate(
    { email: email.toLowerCase(), isDeleted: false },
    { $set: { version, lastLoggedIn: new Date() } },
    { new: true },
    function(err, usr) {
      if (err) {
        res.status(401).json(err);
      } else {
        if (usr == null) {
          res.status(401).json("MESSAGE.USER_NOT_FOUND - user not found");
        } else if (usr.email == email) {
          if (
            usr.oAuthProvider === "Google" ||
            usr.oAuthProvider === "Facebook" ||
            usr.oAuthProvider === "Twitter"
          ) {
            if (usr.oAuthProvider === "Google")
              res.status(400).json({ social: true, provider: "Google" });
            if (usr.oAuthProvider === "Facebook")
              res.status(400).json({ social: true, provider: "Facebook" });
            if (usr.oAuthProvider === "Twitter")
              res.status(400).json({ social: true, provider: "Twitter" });
          } else if (usr.isVerified !== "true" /*have to change*/) {
            bcrypt.compare(password, usr.password, function(err, rs) {
              if (rs == true) {
                let token = jwtAuth.createJWToken({
                  sessionData: { username: usr.email }
                });
                console.log(`User logged in from version: ${version}`);
                res.status(200).json({
                  message: "Loggedin Sucessfully",
                  user: userProfile(usr),
                  token_value: {
                    access_token: token
                  }
                });
              } else {
                res
                  .status(401)
                  .json("MESSAGE.LOGIN_FAILED-after password compare");
              }
            });
          } else {
            res.status(401).json("MESSAGE.LOGIN_FAILED-isverfied");
          }
        } else {
          res.status(401).json("MESSAGE.USER_NOT_FOUND - email");
        }
      }
    }
  );
};

// Get Restaurant Profile - GET
RestaurantController.getRestaurantDetail = (req, res) => {
  const restID = req._restID;
  db.Restaurant.findOne({ _id: restID, isDeleted: false }, function(
    err,
    result
  ) {
    if (err) {
      res.status(401).json(err);
    } else if (!result) {
      res.status(200).json(MESSAGE.NO_DATA);
    } else {
      res.status(400).json(profile.restProfile(result));
    }
  });
};

//Edit Restaurant Profile - POST
RestaurantController.editRestaurantProfile = (req, res) => {
  db.Restaurant.findOneAndUpdate(
    { _id: req._restID },
    { $set: req.body },
    (err, result) => {
      if (err) res.status(404).json(err);
      else res.status(400).json(result);
    }
  );
};

// post restaurants profile  by admin  --
RestaurantController.addRestaurant = (req, res) => {
  const { name, email } = req.body;
  const restaurantProfile = new db.Restaurant({
    uid: puid.generate(),
    name,
    email,
    adminId: req._id,
    isVerified: false,
    oAuth: false,
    oAuthProvider: "voicefirst",
    isDeleted: false,
    "geoLocation.type": "Point",
    "geoLocation.coordinates": [0.0, 0.0]
  });

  var validate = restaurantProfile.joiValidateAdmin(restaurantProfile);
  if (validate.error) {
    res.status(422).json(validate.error);
  } else {
    db.Restaurant.findOne({ email: req.body.email }, (err, usr) => {
      if (err) {
        res.status(500).json(MESSAGE.DATABASE_ERROR);
      } else {
        if (usr == null) {
          restaurantProfile.save((err, restData) => {
            if (err) {
              res.status(400).json(err);
            } else {
              db.RestAdmin.findOneAndUpdate(
                { _id: req._id },
                { $push: { restID: restData._id } },
                { new: true },
                (err, adminData) => {
                  if (err) {
                    res.status(400).json(err);
                  } else {
                    var token = jwtAuth.createJWToken({
                      sessionData: {
                        username: adminData.uid,
                        id: adminData._id,
                        role: adminData.role,
                        restID: adminData.restID
                      }
                    });
                    res.status(200).json({
                      token_value: {
                        message: "Data Saved",
                        restaurant: restData,
                        access_token: token
                      }
                    });
                  }
                }
              );
            }
          });
        } else {
          res.status(200).json(MESSAGE.USER_EXISTS);
        }
      }
    });
  }
};

// add restaurants profile by manager
RestaurantController.addRestaurantDetail = (req, res) => {
  const data = {
    companyName: req.body.companyName,
    phoneNo: req.body.phoneNo,
    profileImage: req.body.profileImage,
    restaurantType: req.body.restaurantType,
    geoLocation: req.body.geoLocation,
    restaurantAddress: req.body.restaurantAddress,
    description: req.body.description,
    picture: req.body.picture,
    ambience: req.body.ambience,
    menu: req.body.menu,
    cuisine: req.body.cuisine,
    tags: req.body.tags,
    alcohol: req.body.alcohol,
    services: req.body.services,
    PackingCharge: req.body.PackingCharge,
    seating: req.body.seating,
    paymentMode: req.body.paymentMode,
    operatingDays: req.body.operatingDays,
    panNo: req.body.panNo,
    panCopy: req.body.panCopy,
    fssaiCertificate: req.body.fssaiCertificate,
    gstin: req.body.gstin,
    gst: req.body.gst,
    ServiceFee: req.body.ServiceFee,
    invoiceProof: req.body.invoiceProof,
    accountNumber: req.body.accountNumber,
    ifscCode: req.body.ifscCode
  };
  var validate = JoiValidate.joiValidateRestDetails(data);
  if (validate.error) {
    res.status(422).json(validate.error);
  } else {
    db.Restaurant.findByIdAndUpdate(req._restID, { $set: data }, { new: true })
      .then(UpdatedData => {
        res.status(200).json(UpdatedData);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  }
};

RestaurantController.getToDo = (req, res) => {
  db.TodoList.find({ restAdminID: req._id }, function(err, mydata) {
    if (!err && mydata.length > 0) {
      res.status(200).json(mydata);
    } else {
      res.status(500).json(MESSAGE.NO_DATA);
    }
  });
};

RestaurantController.postToDo = (req, res) => {
  const toDodata = {
    restAdminID: req._id,
    todoText: req.body.todoText
  };
  var valid = JoiValidate.todoValidation(toDodata);
  if (valid.error) {
    res.status(400).json(valid.error);
  } else {
    const todotext = new db.TodoList(toDodata);
    todotext.save((err, result) => {
      if (!err) {
        res.status(200).json(result);
      } else {
        res.status(401).json(MESSAGE.INTERNAL_ERROR);
      }
    });
  }
};

RestaurantController.updateToDo = (req, res) => {
  const toDodata = {
    restAdminID: req._id,
    todoText: req.body.todoText,
    IsCompleted: req.body.IsCompleted
  };
  var valid = JoiValidate.todoValidation(toDodata);
  if (valid.error) {
    res.status(500).json(valid.error);
  } else {
    db.TodoList.findOneAndUpdate(
      { restAdminID: req._id, _id: req.body.todoID },
      toDodata,
      { new: true }
    )
      .then(UpdatedData => {
        res.status(200).json(UpdatedData);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  }
};

RestaurantController.deleteToDo = (req, res) => {
  db.TodoList.findOneAndRemove({ restAdminID: req._id, _id: req.body.todoID })
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

//Menu Controllers
// Add MEnu Item - POST
RestaurantController.addMenuItem = (req, res) => {
  const menuData = {
    uid: puid.generate(),
    restID: req._restID,
    name: req.body.name,
    category: req.body.category,
    isPopular: req.body.isPopular,
    type: req.body.type,
    customisations: req.body.customisations,
    cuision: req.body.cuision,
    nutritions: req.body.nutritions,
    description: req.body.description,
    price: req.body.price,
    code: req.body.code
  };
  var valid = JoiValidate.menuValidation(menuData);
  if (valid.error) {
    res.status(400).json(valid.error);
  } else {
    const data = new db.Dishes(menuData);
    data.save((err, result) => {
      if (!err) {
        res.status(200).json(result);
      } else {
        res.status(401).json(MESSAGE.INTERNAL_ERROR);
      }
    });
  }
};
// Get Menu Items - GET //For both Customer and Restaurant
RestaurantController.getMenu = (req, res) => {
  db.Dishes.find({ restID: req._restID, isDeleted: false }, (err, data) => {
    if (!err) {
      res.status(200).json(data);
    } else {
      res.status(401).json(MESSAGE.INTERNAL_ERROR);
    }
  });
};

// Edit Menu Item - PUT
RestaurantController.editMenuItem = (req, res) => {
  const data = {
    restID: req._restID,
    name: req.body.name,
    category: req.body.category,
    isPopular: req.body.isPopular,
    type: req.body.type,
    customisations: req.body.customisations,
    cuision: req.body.cuision,
    nutritions: req.body.nutritions,
    description: req.body.description,
    price: req.body.price
  };
  var valid = JoiValidate.menuValidation(data);
  if (valid.error) {
    res.status(400).json(valid.error);
  } else {
    db.Dishes.findByIdAndUpdate(
      req.body.menuID,
      { $set: data },
      { new: true },
      (err, data) => {
        if (!err) {
          res.status(200).json(data);
        } else {
          res.status(401).json(MESSAGE.INTERNAL_ERROR);
        }
      }
    );
  }
};

// Delete Menu Item - DELETE
RestaurantController.deleteMenuItem = (req, res) => {
  db.Dishes.findOneAndUpdate(
    { _id: req.query.id, restID: req._restID },
    { $set: { isDeleted: true } },
    (err, data) => {
      if (!err) {
        console.log("ge00");
        res.status(200).json(true);
      } else {
        res.status(401).json(MESSAGE.INTERNAL_ERROR);
      }
    }
  );
};

// add restaurant events
RestaurantController.addEvent = (req, res) => {
  const eventData = {
    restID: req._restID,
    eventName: req.body.eventName,
    occasion: req.body.occasion,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    dateEvent: req.body.dateEvent,
    entryFees: req.body.entryFees,
    offers: req.body.offers,
    description: req.body.description
  };
  var valid = JoiValidate.restaurantsEvents(eventData);
  if (valid.error) {
    res.status(400).json(valid.error);
  } else {
    const addEvent = new db.RestaurantEvent(eventData);
    addEvent.save((err, data) => {
      if (!err) {
        res.status(200).json(data);
      } else {
        res.status(401).json(MESSAGE.INSUFFICIENT_DATA);
      }
    });
  }
};

// get Restaurants events

RestaurantController.getEvent = (req, res) => {
  if (req._restID) {
    db.RestaurantEvent.find({ restID: req._restID, isDeleted: false })
      .populate("restaurant")
      .exec(function(err, result) {
        if (err) res.status(500).json(err);
        res.status(200).json(result);
      });
  } else {
    res.status(404);
  }
};

// edit event by manager
RestaurantController.editEvent = (req, res) => {
  const eventData = {
    restID: req._restID,
    eventName: req.body.eventName,
    occasion: req.body.occasion,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    dateEvent: req.body.dateEvent,
    entryFees: req.body.entryFees,
    offers: req.body.offers,
    description: req.body.description
  };
  var valid = JoiValidate.restaurantsEvents(eventData);
  if (valid.error) {
    res.status(400).json(valid.error);
  } else {
    db.RestaurantEvent.findByIdAndUpdate(
      { _id: req.body.eventID },
      { $set: eventData },
      { new: true },
      (err, result) => {
        if (err) res.status(404).json(err);
        else res.status(200).json(result);
      }
    );
  }
};

// delete event by manager
RestaurantController.deleteEvent = (req, res) => {
  db.RestaurantEvent.findByIdAndDelete(
    { _id: req.query.eventID },
    (err, result) => {
      if (err) {
        res.status(404).json(err);
      } else if (result) {
        res.status(200).json(true);
      } else {
        res.status(400).json(MESSAGE.NO_DATA);
      }
    }
  );
};

//add reservation by managers
RestaurantController.addReservation = (req, res) => {
  const data = {
    restID: req._restID,
    customerName: req.body.customerName,
    phoneNo: req.body.phoneNo,
    reserveDate: req.body.reserveDate,
    email: req.body.email,
    time: req.body.time,
    occasion: req.body.occasion,
    guestCount: req.body.guestCount
  };
  var valid = JoiValidate.addReservationValidation(data);
  if (valid.error) {
    res.status(401).json(valid.error);
  } else {
    const addCustReservation = new db.CustomerReservation(data);
    addCustReservation.save((err, myData) => {
      if (err) {
        res.status(400).json(MESSAGE.INSUFFICIENT_DATA);
      } else if (data) {
        res.status(200).json(myData);
      } else {
        res.status(404).json(MESSAGE.DATABASE_ERROR);
      }
    });
  }
};

// get reservation
RestaurantController.getReservation = (req, res) => {
  if (req._restID) {
    db.CustomerReservation.find({
      restID: req._restID,
      isDeleted: false
    })
      .populate("restaurant")
      .exec(function(err, result) {
        if (err) res.status(500).json(err);
        res.status(200).json(result);
      });
  } else {
    res.status(404);
  }
};

// edit reservation
RestaurantController.editReservation = (req, res) => {
  const data = {
    restID: req._restID,
    customerName: req.body.customerName,
    phoneNo: req.body.phoneNo,
    reserveDate: req.body.reserveDate,
    email: req.body.email,
    time: req.body.time,
    occasion: req.body.occasion,
    guestCount: req.body.guestCount
  };
  var valid = JoiValidate.addReservationValidation(data);
  if (valid.error) {
    res.status(401).json(valid.error);
  } else {
    db.CustomerReservation.findByIdAndUpdate(
      { _id: req.body.reservedID },
      { $set: data },
      { new: true },
      (err, result) => {
        if (err) res.status(404).json(err);
        else if (result) {
          res.status(200).json(result);
        } else {
          res.status(404).json(MESSAGE.NO_DATA);
        }
      }
    );
  }
};

// delete reservation
RestaurantController.deleteReservation = (req, res) => {
  db.CustomerReservation.findOneAndUpdate(
    { _id: req.query.reservedID, restID: req._restID },
    { $set: { isDeleted: true } },
    (err, result) => {
      if (err) {
        res.status(404).json(err);
      } else if (result) {
        res.status(200).json(true);
      } else {
        res.status(400).json(MESSAGE.NO_DATA);
      }
    }
  );
};

// get customers reviews -

// get restaurants rating and reviews
RestaurantController.getReview =(req,res)=>{
  const restID= req._restID;
  var rating = new Promise((resolve, reject) => {
    db.Restaurant.findOne(
      { _id: restID },
      { restaurantRating: 1 },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    )
  });
  var reviews = new Promise((resolve, reject) => {
    db.CustomerReview.find(
      {
        restID: restID,
        isDeleted: false
      })
      .populate("custID")
      .exec(function (err, result) {
        if (err) {
          reject(err);
        } else if (result) {
          resolve(returnData.CustomerRating(result));
        } else {
          reject(err);
        }
      });
  })
  Promise.all([
    rating.catch(err => {
      return err;
    }),
    reviews.catch(err => {
      return err;
    })
  ]).then(reviewrate => {
    res.json(reviewrate);
  }).catch(err => {
    res.send(err);
  })
}


// add response to customer review
RestaurantController.addResponse = (req, res) => {
  const data = {
    custID: req.body.custID,
    restID: req._restID,
    restaurantResponse: req.body.response
  };
  var valid = JoiValidate.responseValidation(data);
  if (valid.error) {
    res.status(400).json(valid.error);
  } else {
    db.CustomerReview.findOne(
      {
        $and: [
          { custID: req.body.custID },
          { restID: req._restID },
          { isDeleted: false }
        ]
      },
      (err, response) => {
        if (err) {
          res.status(500).json(err);
        } else if (response) {
          db.CustomerReview.findByIdAndUpdate(
            { _id: response._id },
            {
              $set: {
                restaurantResponse: req.body.response
              }
            },
            {
              new: true
            },
            (err, result) => {
              if (err) {
                res.status(500).json(err);
              } else if (result) {
                res.status(200).json(result);
              } else {
                res.status(401).json(MESSAGE.DATABASE_ERROR);
              }
            }
          );
        } else {
          res.status(500).json(MESSAGE.NO_DATA);
        }
      }
    );
  }
};

// update response
RestaurantController.editResponse = (req, res) => {
  const data = {
    custID: req.body.custID,
    restID: req._restID,
    restaurantResponse: req.body.response
  };
  var valid = JoiValidate.responseValidation(data);
  if (valid.error) {
    res.status(400).json(valid.error);
  } else {
    db.CustomerReview.findOne(
      {
        $and: [
          { custID: req.body.custID },
          { restID: req._restID },
          { isDeleted: false }
        ]
      },
      (err, data) => {
        if (err) {
          res.status(500).json(err);
        } else if (data.restaurantResponse) {
          db.CustomerReview.findByIdAndUpdate(
            { _id: data._id },
            {
              $set: {
                restaurantResponse: req.body.response
              }
            },
            {
              new: true
            },
            (err, result) => {
              if (err) {
                res.status(500).json(err);
              } else if (result) {
                res.status(200).json(result);
              } else {
                res.status(401).json(MESSAGE.DATABASE_ERROR);
              }
            }
          );
        } else {
          res.status(500).json(MESSAGE.NO_DATA);
        }
      }
    );
  }
};

// delete response
RestaurantController.deleteResponse = (req, res) => {
  db.CustomerReview.findByIdAndUpdate(
    req.params.responceID,
    {
      $set: {
        restaurantResponse: ""
      }
    },
    {
      new: true
    },
    (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else if (result) {
        res.status(200).json(true);
      } else {
        res.status(401).json(MESSAGE.DATABASE_ERROR);
      }
    }
  );
};

// promocode
RestaurantController.addPromocode = (req, res) => {
  const data = {
    restID: req._restID,
    code: req.body.code,
    discount: req.body.discount,
    maxDiscount: req.body.maxDiscount,
    cashback: req.body.cashback,
    startDate: req.body.startDate,
    expiryDate: req.body.expiryDate
  };
  var valid = JoiValidate.promocodeValidation(data);
  if (valid.error) {
    res.status(400).json(valid.error);
  } else {
    db.Promocode.findOne(
      { restID: req._restID, code: req.body.code, applicable: true },
      (err, result) => {
        if (err) {
          res.status(401).json(err);
        } else if (result) {
          //  if some item is in cart BUT not duplicate adding
          res.status(200).json({ message: "Already exists" });
        } else {
          //  first time in cart adding
          const addCode = new db.Promocode(data);
          addCode.save((err, result) => {
            if (!err) {
              res.status(200).json(result);
            } else {
              res.status(401).json(err);
            }
          });
        }
      }
    );
  }
};
RestaurantController.editPromocode = (req, res) => {
  const data = {
    restID: req._restID,
    code: req.body.code,
    discount: req.body.discount,
    maxDiscount: req.body.maxDiscount,
    cashback: req.body.cashback,
    startDate: req.body.startDate,
    expiryDate: req.body.expiryDate
  };
  var valid = JoiValidate.promocodeValidation(data);
  if (valid.error) {
    res.status(300).json(valid.error);
  } else {
    db.Promocode.findByIdAndUpdate(
      req.body.promoID,
      { $set: data },
      { new: true },
      (err, UpdateItem) => {
        if (UpdateItem) {
          res.status(200).json(UpdateItem);
        } else {
          res.status(401).json(MESSAGE.INTERNAL_ERROR);
        }
      }
    );
  }
};

// chef dashbord order list --
RestaurantController.orderList = (req, res) => {
  db.Orders.find({ restID: req._restID }, (err, result) => {
    if (err) {
      res.status(401).json(err);
    } else if (result.length) {
      res.status(200).json(result);
    } else {
      res.status(200).json(MESSAGE.NO_DATA);
    }
  });
};
// chef dashboard order list ---
RestaurantController.liveOrderList = (req, res) => {
  db.Orders.find(
    { restID: req._restID, orderStatus: { $ne: "completed" } },
    (err, result) => {
      if (err) {
        res.status(401).json(err);
      } else if (result.length) {
        res.status(200).json(result);
      } else {
        res.status(200).json(MESSAGE.NO_DATA);
      }
    }
  );
};
// change orders status by chef --
RestaurantController.changeOrderStatus = (req, res) => {
  const { orderID, estimatedTime, status } = req.body;
  // global.io.in(orderID).emit('orderUpdate');
  const data = {};
  if (status == "confirmed") {
    if (estimatedTime) {
      data.estimatedTime = estimatedTime;
      data.orderStatus = status;
    } else {
      res.status(400).json(MESSAGE.INSUFFICIENT_DATA);
    }
  }
  if (status == "completed") {
    data.estimatedTime = null;
    data.orderStatus = status;
  }
  data.orderStatus = status;
  db.Orders.findOneAndUpdate(
    { _id: orderID },
    {
      $set: data
    },
    { new: true },
    (err, UpdateItem) => {
      if (err) {
        res.status(401).json(MESSAGE.INTERNAL_ERROR);
      } else {
        if (UpdateItem) {
          global.io.in(orderID).emit('orderUpdate', {result:UpdateItem});
          res.status(200).json(UpdateItem);
        } else {
          res.status(400).json(MESSAGE.NO_DATA);
        }
      }
    }
  );
};

module.exports = RestaurantController;
