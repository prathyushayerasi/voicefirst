const authService = require("../utility/jwtAuth");
const MESSAGE = require("../utility/messages");

function authMiddleware(req, res, next) {
  if(req.cookies){
    var token = req.cookies.auth_token;
  } else {
    var token = req.headers.authorization;
  }
  authService.verifyJWTToken(token).then(
    data => {
      req._username = data.data.username;
      req._id = data.data.id;
      if (data.data.role) {
        req._role = data.data.role;
      }
      if (data.data.restID) {
        req._restID = data.data.restID;
      }
      console.log(req._id);
      return next();
    },
    () => {
      res.status(401).json(MESSAGE.UNAUTHORIZED_ACCESS);
    }
  );
}

// Exporting Middleware
module.exports = authMiddleware;
