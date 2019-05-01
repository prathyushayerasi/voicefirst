const express = require("express");
require("dotenv").config();
const app = express();
const http = require("http");
const cors = require("cors");
const socket = require("socket.io");
const bodyParser = require("body-parser");
const passport = require("passport");

const server = http.createServer(app);
const io = socket(server);
io.use(function (socket, next) {
  //if (socket.request.headers.cookie) return next();
  //next(new Error('Authentication error'));
  return next();
});

const restaurantRoutes = require("./routers/restaurantRoutes");
const utilityRoutes = require("./routers/utilityRoutes");
const restAdminRoutes = require("./routers/restAdminRoutes");



app.use(cors({ origin: true, credentials: true }));
// app.use(bodyParser({ limit: "5mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/restaurant", restaurantRoutes);
app.use("/restAdmin", restAdminRoutes);
app.use("/utility", utilityRoutes);
app.use("/temp", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});


io.on("connection", socket => {
  console.log("A user is conneted");
  socket.on('joinOrderRoom', data => {
    console.log(data);
    var orderID = data.orderID
    socket.join(orderID);
    console.log("joined android", orderID);
  });
  socket.on('joinOrderUpdateRoom', data => {
    socket.join(data.restID);
    console.log("joined order update", data.restID);
  });
});
global.io = io;


module.exports = server;
