const Pid = require("puid");
const bcrypt = require("bcryptjs");
const puid = new Pid();
const db = require("../models/index");
const jwtAuth = require("../utility/jwtAuth");
const MESSAGE = require("../utility/messages");
const moment = require("moment");
const AWS = require("aws-sdk");

const UtilityController = {};

const awsconfig = require("../config/aws-config");
AWS.config.update(awsconfig);

UtilityController.sendOTP = (req, res) => {
  var otp = Math.floor(1000 + Math.random() * 9000);
  const myData = new db.OTP({
    phoneNo: req.body.phoneNo,
    otp,
    time: moment().format()
  });

  var sns = new AWS.SNS();
  var SNS_TOPIC_ARN = "arn:aws:sns:us-west-2:281793537961:Elaachi-OTP";
  var mobile = req.body.phoneNo;
  sns.setSMSAttributes(
    {
      attributes: {
        DefaultSMSType: "Transactional"
      }
    },
    function(error) {
      if (error) {
        console.log(error);
      }
    }
  );
  sns.subscribe(
    {
      Protocol: "sms",
      TopicArn: SNS_TOPIC_ARN,
      Endpoint: mobile
    },
    (error, data) => {
      if (error) {
        console.log("error when subscribe", error);
        return res.json(MESSAGE.S_W_W);
      }
      var message = 
        "Your Voicefirst OTP is " + otp + ". Please don't share it with anyone.";
      console.log("subscribe data", data);
      var SubscriptionArn = data.SubscriptionArn;
      var params = {
        TargetArn: SNS_TOPIC_ARN,
        Message: message, //type your message
        Subject: "type_your_subject" //type your subject
      };
      sns.publish(params, function(err_publish, data) {
        if (err_publish) {
          console.log("Error sending a message", err_publish);
        } else {
          console.log("Sent message:", data.MessageId);
        }
        var params = {
          SubscriptionArn: SubscriptionArn
        };
        sns.unsubscribe(params, function(err, data) {
          if (err) {
            console.log("err when unsubscribe", err);
          }
        });
      });
    }
  );
  myData.save((err, data) => {
    if (!err) {
      res.json(data);
    } else {
      res.status(400).json(MESSAGE.INTERNAL_ERROR);
    }
  });
  // Have to add code for sending OTP to user via text message.
};

UtilityController.verifyOTP = (req, res) => {
  var now = moment().format();
  db.OTP.findOne(
    { phoneNo: req.body.phoneNo, otp: req.body.otp },
    (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else if (!result) {
        res.status(500).json(MESSAGE.NO_DATA);
      } else {
        var ms = moment(now, "YYYY-MM-DD HH:mm:ss").diff(
          moment(result.time, "YYYY-MM-DD HH:mm:ss")
        );
        var d = moment.duration(ms);
        if (d.asSeconds() <= "300") {
          res.status(200).json(true);
        } else {
          res.status(200).json("This OTP is Expired");
        }
      }
    }
  )
    .remove()
    .exec();
};

UtilityController.addLocation = (req, res) => {
  // db.Location.ensureIndexes({ location: "2dsphere" });
  const data = new db.Location();
  data.locationID = req.body.locationID;
  data.location.type = "Point";
  data.location.coordinates = req.body.location;
  data.save((err, data) => {
    if (err) {
      console.log("Mongo Error ", err);
      res.json(err);
    }
    console.log(data);
    res.json(data);
  });
};

UtilityController.getLocations = (req, res) => {
  console.log(req.query.location);
  db.Restaurant.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: req.body.location
        },
        distanceField: "dist.calculated",
        maxDistance: 400,
        includeLocs: "dist.location",
        num: 5,
        spherical: true
      }
    }
  ]).exec((err, data) => {
    if (err) {
      console.log("Mongo Error ", err);
      res.json(err);
    }
    console.log(data);
    res.json(data);
  });
};
module.exports = UtilityController;
