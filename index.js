const app = require("./src/app");
require("dotenv").config();
const mongoose = require("mongoose");
let port = process.env.PORT || 3000;
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true });

mongoose.connection.on("connected", function() {
  console.log("Mongoose default connection open to ");
});

app.listen(port, () => {
  console.log("API is up and Runnning ", port);
});