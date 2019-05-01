const express = require("express");
const router = express.Router();
const RestaurantController = require("../controllers/RestaurantController");
const Employee = require("../middlewares/employeeAuthentication");
const authMiddleware = require("../middlewares/authMiddleware");

//Restaurant Register Route
router.post("/register", RestaurantController.register);

//Restaurant Login route
router.post("/login", RestaurantController.login);

//Restaurant profile routes
router.post("/restaurantDetail", authMiddleware, Employee.isManager, RestaurantController.addRestaurantDetail);
router.post("/addRestaurant", authMiddleware, Employee.isAdmin, RestaurantController.addRestaurant);
router.get("/restaurantDetail", authMiddleware, Employee.isManager, RestaurantController.getRestaurantDetail);

//To-Do routes
router.get("/Todo", authMiddleware, Employee.isManager, RestaurantController.getToDo);
router.post("/Todo", authMiddleware, Employee.isManager, RestaurantController.postToDo);
router.put("/Todo", authMiddleware, Employee.isManager, RestaurantController.updateToDo);
router.delete("/Todo", authMiddleware, Employee.isManager, RestaurantController.deleteToDo);

//Menu routes
router.post("/menu", RestaurantController.addMenuItem); //  authMiddleware, Employee.isManager
router.get("/menu", RestaurantController.getMenu);  //  authMiddleware, Employee.isManager
router.put("/menu", RestaurantController.editMenuItem);  // authMiddleware, Employee.isManager
router.delete("/menu",  RestaurantController.deleteMenuItem);  // authMiddleware, Employee.isManager,

// restaurant event
router.post("/event", authMiddleware, Employee.isManager, RestaurantController.addEvent);
router.get("/event", authMiddleware, Employee.isManager, RestaurantController.getEvent);
router.put("/event", authMiddleware, Employee.isManager, RestaurantController.editEvent);
router.delete("/event", authMiddleware, Employee.isManager, RestaurantController.deleteEvent);

// customer reservation
router.post("/reservation", authMiddleware, Employee.isManager, RestaurantController.addReservation);
router.get("/reservation", authMiddleware, Employee.isManager, RestaurantController.getReservation);
router.put("/reservation", authMiddleware, Employee.isManager, RestaurantController.editReservation);
router.delete("/reservation", authMiddleware, Employee.isManager, RestaurantController.deleteReservation);

// reviews list of customers
router.get("/review", authMiddleware, Employee.isManager, RestaurantController.getReview);
router.post("/review", authMiddleware, Employee.isManager, RestaurantController.addResponse);
router.put("/review", authMiddleware, Employee.isManager, RestaurantController.editResponse);
router.delete("/review/:responceID", authMiddleware, Employee.isManager, RestaurantController.deleteResponse);

// promoCode
router.post("/promocode", authMiddleware, Employee.isManager, RestaurantController.addPromocode);
router.put("/promocode", authMiddleware, Employee.isManager, RestaurantController.editPromocode);

// chef dashboard order list --
router.get("/orders",  RestaurantController.orderList);  // authMiddleware, Employee.isManager,
router.get("/liveorders", RestaurantController.liveOrderList); //  authMiddleware, Employee.isManager,
router.post("/changeOrderStatus", RestaurantController.changeOrderStatus);  // authMiddleware, Employee.isChef,
module.exports = router;