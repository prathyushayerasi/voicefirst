const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware")
const RestAdminController = require("../controllers/RestAdminController");
const Employee = require("../middlewares/employeeAuthentication");

//Admin register
router.post("/adminRegister", RestAdminController.adminRegister);

// Add employee  restaurants
router.post("/employee", authMiddleware, Employee.isAdmin, RestAdminController.addEmployee);
router.get("/employee", authMiddleware, Employee.isAdmin, RestAdminController.getEmployees);
router.post("/resendSignUpMail", authMiddleware, Employee.isAdmin, RestAdminController.resendSignUpMail);

router.get("/token", authMiddleware, Employee.isAdmin, RestAdminController.getToken);
router.get("/restaurants", authMiddleware, Employee.isAdmin, RestAdminController.getRestaurants);

router.post("/signUp", RestAdminController.employeeSignUp);
router.post("/signIn", RestAdminController.signIn);


//Forgot Password and Change Password
router.post("/forgotPassword", RestAdminController.forgotPassword);
router.post("/resetPassword", RestAdminController.resetPassword);


router.post("/changePassword", authMiddleware, RestAdminController.changePassword);

module.exports = router;
