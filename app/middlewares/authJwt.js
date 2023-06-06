const jwt = require("jsonwebtoken");
const config = require("../config/index");
const USER = require("../models/user.model");

verifyToken = (req, res, next) => {
  let token = req.body.accessToken;
  // console.log(token)
  if (!token) {
    // return res.status(403).send({ message: "No token provided!" });
    return res.send(null);
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

// isAdmin = (req, res, next) => {
//   USER.findById(req.userId).exec((err, user) => {
//     if (err) {
//       res.status(500).send({ message: err });
//       return;
//     }

//     ROLE.find(
//       {
//         _id: { $in: user.roles },
//       },
//       (err, roles) => {
//         if (err) {
//           res.status(500).send({ message: err });
//           return;
//         }

//         for (let i = 0; i < roles.length; i++) {
//           if (roles[i].name === "admin") {
//             next();
//             return;
//           }
//         }

//         res.status(403).send({ message: "Require Admin Role!" });
//         return;
//       }
//     );
//   });
// };

const authJwt = {
  verifyToken,
  // isAdmin
};
module.exports = authJwt;