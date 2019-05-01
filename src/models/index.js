const Customer = require('./customerSchema');
const Restaurant = require('./restaurantSchema');
const CustomerReview = require('./customerReviewSchema');
const BeenHere = require('./beenHereSchema');
const Dishes = require('./dishesSchema');
const Orders = require('./ordersSchema');
const TodoList = require('./toDoListSchema');
const Bookmarks = require('./bookMarkSchema');
const OTP = require('./otpSchema');
const RestaurantEvent = require('./restaurantEvent');
const CustomerReservation = require('./customerReservationSchema');
const Location = require("./locations");
const Cart = require("./cartSchema");
const Promocode = require("./promoCodeSchema");
const RestAdmin = require("./restAdminSchema");
const FoodWallet = require("./foodWallet");
const AdvanceBooking = require("./advanceBooking");
const CustomerFeedback=require("./custFeedback");
const CustomerReport = require("./custRAProblem");
const LoyaltyPoint = require("./loyaltyPoint");
const AboutApp = require("./aboutAppSchema");
const FeedbackApp = require("./feedbackAppSchema");
const ReportApp = require("./reportAProblemApp");

module.exports = {
    Customer,
    Restaurant,
    CustomerReview,
    BeenHere,
    Dishes,
    Orders,
    TodoList,
    Bookmarks,
    OTP,
    RestaurantEvent,
    CustomerReservation,
    Location,
    Cart,
    Promocode,
    RestAdmin,
    FoodWallet,
    AdvanceBooking,
    CustomerFeedback,
    CustomerReport,
    LoyaltyPoint,
    AboutApp,
    FeedbackApp,
    ReportApp
}