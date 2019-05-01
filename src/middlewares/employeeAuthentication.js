const MESSAGE = require("../utility/messages");

const isAdmin = (req, res, next) => {
  if (req._role == "admin") {
    console.log("Admin with Rest", req._restID);
    next();
  } else {
    return res.status(401).json(MESSAGE.PERMISSION_DENIED);
  }
};

const isManager = (req, res, next) => {
  if (req._role == "admin" || req._role == "manager") {
    console.log("Manager with Rest", req._restID);
    next();
  } else {
    return res.status(401).json(MESSAGE.PERMISSION_DENIED);
  }
};

const isChef = (req, res, next) => {
  if (req._role == "admin" || req._role == "manager" || req._role == "chef") {
    console.log("Chef with Rest", req._restID);
    next();
  } else {
    return res.status(401).json(MESSAGE.PERMISSION_DENIED);
  }
};

module.exports = {
  isAdmin,
  isManager,
  isChef
};
