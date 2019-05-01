const Pid = require("puid");
const bcrypt = require("bcryptjs");
const puid = new Pid();
const randomstring = require("randomstring");
const db = require("../models/index");
const jwtAuth = require("../utility/jwtAuth");
const RestAdminController = {};
const MESSAGE = require("../utility/messages");
const AWS = require("aws-sdk");
const awsconfig = require("../config/aws-config");
AWS.config.update(awsconfig);
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const mailer = require("../utility/mailer");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const userProfile = user => ({
  name: user.name,
  email: user.email,
  uid: user.uid,
  phontNo: user.phontNo,
  username: user.username,
  profileImage: user.profileImage,
  lastLoggedIn: user.lastLoggedIn,
  createdAt: user.createdAt,
  restID: user.restID,
});

RestAdminController.forgotPassword = (req, res) => {
  const passwordKey = randomstring.generate({
    length: 26
  });
  db.RestAdmin.findOneAndUpdate(
    { email: req.body.email },
    { $set: { passwordKey: passwordKey } },
    (err, usr) => {
      if (usr == null) {
        res.json({ message: "USER_NOT_FOUND" });
      } else {
        const token = jwt.sign({ email: usr.email, passwordKey }, jwtSecret, {
          expiresIn: "1d"
        });
        sgMail.send(
          mailer.ForgotPasswordMailMsg(usr.email, usr.name, token),
          (error, info) => {
            if (error) {
              return console.log(error);
            }
            res.json({ message: "PASSWORD_RESET" });
            console.log("Message %s sent: %s", info.messageId, info.response);
          }
        );
      }
    }
  );
};

RestAdminController.changePassword = (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (oldPassword && newPassword) {
    db.RestAdmin.findById(req._id, { password: 1 }, (err, result) => {
      if (err) {
        res.status(400).json(err);
      } else {
        if (result) {
          bcrypt.compare(oldPassword, result.password, function(err, pass) {
            if (pass) {
              bcrypt.genSalt(function(err, salt) {
                bcrypt.hash(newPassword, salt, function(err, hash) {
                  var newPass = hash;
                  db.RestAdmin.findByIdAndUpdate(
                    req._id,
                    { $set: { password: newPass } },
                    (err, data) => {
                      if (data) {
                        res
                          .status(200)
                          .json({ message: "Password Changed Successfully" });
                      }
                    }
                  );
                });
              });
            } else {
              res.status(401).json({ message: "Incorrect Old Password" });
            }
          });
        } else {
          res.status(200).json(MESSAGE.INTERNAL_ERROR);
        }
      }
    });
  } else {
    res.status(400).json({
      message: MESSAGE.INSUFFICIENT_DATA
    });
  }
};

RestAdminController.resetPassword = (req, res) => {
  console.log(jwt.verify(req.body.token, jwtSecret));
  const { password, token } = req.body;
  const decoded = jwt.verify(token, jwtSecret);
  const { email, passwordKey } = decoded;
  const newPasswordKey = randomstring.generate({
    length: 26
  }); // Setting new password key so that the old password key isn't misused .
  //not setting to null since it could be vulnerable
  db.RestAdmin.findOne({ email, passwordKey }, (error, user) => {
    console.log(user);
    if (error || !user)
      return res.status(401).json({ error: "INVALID_CREDENTIALS" });
    bcrypt.genSalt(function(err, salt) {
      bcrypt.hash(password, salt, (err, hash) => {
        db.RestAdmin.findOneAndUpdate(
          { email: email },
          { $set: { password: hash, passwordKey: newPasswordKey } },
          (err, usr) => {
            if (usr == null) {
              res.json(MESSAGE.WRONG_EMAIL);
            } else {
              sgMail.send(
                mailer.changePasswordMailMsg(usr.email, usr.name),
                (error, info) => {
                  if (error) {
                    return console.log(error);
                  } else {
                    res.json({
                      message: "Password has been successfully changed"
                    });
                    console.log(
                      "Message %s sent: %s",
                      info.messageId,
                      info.response
                    );
                  }
                }
              );
            }
          }
        );
      });
    });
  });
};

// add restaurants manager
RestAdminController.addEmployee = (req, res) => {
  let uid = puid.generate();
  password = randomstring.generate({
    length: 18
  });
  if (req.body.email == undefined || req.body.email == "") {
    return res.status(400).json(MESSAGE.INSUFFICIENT_DATA);
  }
  if (req.body.role !== "chef" && req.body.role !== "manager") {
    return res.status(401).json(MESSAGE.UNAUTHORIZED_ACCESS);
  }
  if (!req._restID) {
    return res.status(401).json(MESSAGE.UNAUTHORIZED_ACCESS);
  }
  const passwordKey = randomstring.generate({
    length: 26
  });
  const mydata = new db.RestAdmin({
    uid,
    email: req.body.email.toLowerCase(),
    password: password,
    profileImage: "xyzxyz",
    restID: req._restID,
    role: req.body.role,
    passwordKey
  });
  db.RestAdmin.findOne({ email: req.body.email }, (err, result) => {
    if (err) {
      res.status(400).json(err);
    } else if (result) {
      res.status(200).json(MESSAGE.USER_EXISTS);
    } else {
      mydata.save((err, result) => {
        if (err) {
          res.status(400).json(err);
        } else if (result) {
          //  add employee to restaurant schema detail
          db.Restaurant.findOneAndUpdate(
            { _id: req._restID },
            { $push: { employees: { [req.body.role]: result._id } } }, ()=>{}
          );
          const token = jwt.sign(
            {
              email: result.email,
              role: result.role,
              passwordKey: result.passwordKey
            },
            jwtSecret,
            {}
          );
          console.log(token);
          sgMail.send(
            mailer.addEmployeeMail(result.email, result.role, token),
            (error, info) => {
              if (error) {
                return console.log(error);
              }
              res.json({ message: "Added Sucessfully" });
              console.log("Message sent successfully ", info);
            }
          );
        } else {
          res.status(401).json(MESSAGE.INTERNAL_ERROR);
        }
      });
    }
  });
};

//Resend SingUp Mail
RestAdminController.resendSignUpMail = (req, res) => {
  db.RestAdmin.findOne(
    { restID: req._restID, email: req.body.email },
    (err, result) => {
      if (err) {
        res.status(400).json(err);
      } else if (result) {
        //  add employee to restaurant schema detail
        const token = jwt.sign(
          {
            email: result.email,
            role: result.role,
            passwordKey: result.passwordKey
          },
          jwtSecret,
          {}
        );
        console.log(token);
        sgMail.send(
          mailer.addEmployeeMail(result.email, result.role, token),
          (error, info) => {
            if (error) {
              return console.log(error);
            }
            res.json({ message: "SignUp mail sent again." });
            console.log("Message sent successfully ", info);
          }
        );
      } else {
        res.status(401).json(MESSAGE.INTERNAL_ERROR);
      }
    }
  );
};

// Add Employee detail
RestAdminController.employeeSignUp = (req, res) => {
  console.log(jwt.verify(req.body.token, jwtSecret));
  const {
    password,
    name,
    phoneNo,
    profileImage,
    location,
    device,
    browser,
    token
  } = req.body;
  var Aname = name.charAt(0).toUpperCase() + name.slice(1);
  const decoded = jwt.verify(token, jwtSecret);
  const { email, role, passwordKey } = decoded;
  const newPasswordKey = randomstring.generate({
    length: 26
  });
  bcrypt.genSalt(function(err, salt) {
    bcrypt.hash(password, salt, (err, hash) => {
      db.RestAdmin.findOneAndUpdate(
        { email, role, passwordKey },
        {
          $set: {
            password: hash,
            name: Aname,
            phoneNo,
            profileImage,
            location,
            device,
            browser,
            passwordKey: newPasswordKey,
            lastLoggedIn: new Date(),
            createdAt: new Date(),
            isVerified: true
          }
        },
        { new: true },
        function(err, usr) {
          if (err) {
            res.status(401).json(err);
          } else {
            if (usr == null) {
              res.status(401).json("MESSAGE.INVALID_LINK");
            } else {
              let token = jwtAuth.createJWToken({
                sessionData: { username: usr.uid, id: usr._id, role: usr.role }
              });
              console.log(`User SignUp`);
              res.status(200).json({
                message: "Loggedin Sucessfully",
                user: userProfile(usr),
                token_value: {
                  access_token: token
                }
              });
            }
          }
        }
      );
    });
  });
};

RestAdminController.getToken = (req, res) => {
  var rest = req.query.restID;
  db.RestAdmin.findOne({_id: req._id, restID: rest},(err, usr)=> {
    if(err){
      return res.json(err);
    }
    else if (usr){
      var token = jwtAuth.createJWToken({
          sessionData: { username: usr.uid, id: req._id, role: usr.role, restID: rest }
        });
      return res.json(token);
    }
  });
}

RestAdminController.getRestaurants = (req, res) => {
  db.RestAdmin.findOne({_id: req._id}).populate("restID")
  .exec((err, result) => {
    if(err){
      return res.status(400).json(err);
    }
    else if (result){
      return res.json(result.restID);
    }
  })
}

//Employee Sign Up - Admin, Chef, Manager
RestAdminController.signIn = (req, res) => {
  const password = req.body.password;
  db.RestAdmin.findOneAndUpdate(
    { email: req.body.email.toLowerCase(), isDeleted: false },
    { $set: { lastLoggedIn: new Date() } },
    { new: true },
    function(err, usr) {
      if (err) {
        res.status(401).json(err);
      } else {
        if (!usr) {
          res.status(401).json(MESSAGE.USER_NOT_FOUND);
        } else if (usr.isVerified !== "true" /* Have to cahnge */) {
          bcrypt.compare(password, usr.password, function(err, rs) {
            if (rs == true) {
              if( usr.role != "admin" ){
                var token = jwtAuth.createJWToken({
                  sessionData: { username: usr.uid, id: usr._id, role: usr.role, restID: usr.restID }
                });
              } else {
                var token = jwtAuth.createJWToken({
                  sessionData: { username: usr.uid, id: usr._id, role: usr.role }
                });
              }
              res.status(200).json({
                message: "Loggedin Sucessfully",
                user: userProfile(usr),
                token_value: {
                  access_token: token
                  // expiresIn:
                }
              });
            } else {
              res.status(401).json("Wrong Password");
            }
          });
        } else {
          res.status(401).json(MESSAGE.NOT_VERIFIED);
        }
      }
    }
  );
};

//Admin Registration
RestAdminController.adminRegister = (req, res) => {
  const {
    name,
    email,
    password,
    phoneNo,
    location,
    device,
    browser
  } = req.body;
  var Aname = name.charAt(0).toUpperCase() + name.slice(1);
  let Email = email.toLowerCase();
  let uid = puid.generate();
  const passwordKey = randomstring.generate({
    length: 26
  });
  const RestAdmin = new db.RestAdmin({
    uid,
    name: Aname,
    email: Email,
    password,
    passwordKey,
    phoneNo,
    lastLoggedIn: new Date(),
    createdAt: new Date(),
    device,
    location,
    browser,
    role: "admin"
  });
  var validate = RestAdmin.joiValidate(RestAdmin);
  if (validate.error) {
    res.status(422).json(validate.error);
  } else {
    db.RestAdmin.findOne(
      { $or: [{ email: Email }, { phoneNo: phoneNo }] },
      (err, usr) => {
        if (err) {
          console.log("Fail");
          res.status(500).json(MESSAGE.DATABASE_ERROR);
        } else {
          if (usr == null) {
            bcrypt.genSalt(function(err, salt) {
              bcrypt.hash(RestAdmin.password, salt, function(err, hash) {
                RestAdmin.password = hash;
                RestAdmin.profileImage = "hello";
                //   DEFAULT_PROFILE_IMAGES[Math.floor(Math.random() * 2)];
                RestAdmin.save((err, data) => {
                  if (err) {
                    res.status(500).json({ err });
                    console.log("Unable to register at this point");
                  }
                  res.status(200).json({
                    message: "Successfully Registered, User not Verified",
                    user: userProfile(data)
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
      }
    );
  }
};

//Get Employees in a Restaurant
RestAdminController.getEmployees = (req, res) => {
  db.RestAdmin.findOne({ _id: req._id }, (err, result) => {
    if (err) {
      res.status(404).json(MESSAGE.INTERNAL_ERROR);
    } else if (result) {
      db.RestAdmin.find({ restID: result.restID, role: { $ne: "admin"}  }, (err, data) => {
        if (err) {
          res.status(404).json(err);
        } else if (data) {
          res.status(401).json(data);
        } else {
          res.status(404).json(MESSAGE.NO_DATA);
        }
      });
    } else {
      res.status(404).json(MESSAGE.NO_DATA);
    }
  });
};

module.exports = RestAdminController;
