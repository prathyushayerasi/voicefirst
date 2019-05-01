const express = require("express");
const router = express.Router();

const UtilityController = require("../controllers/UtilityControllers");

router.post("/otpgen", UtilityController.sendOTP);

router.post("/verifyotp", UtilityController.verifyOTP);

// router.post('/location', UtilityController.addLocation);
router.post("/location", UtilityController.getLocations);
module.exports = router;
