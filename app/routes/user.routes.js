const { authJwt } = require("../middlewares/index");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.put("/api/auth/updateinfouser/:id",controller.updateInfoUser)
  app.put("/api/auth/changepassword/:id",controller.changePassword)
  app.post("/api/auth/getinfo", [authJwt.verifyToken], controller.getInfoUser);
};