const jwt = require("jsonwebtoken");
require("dotenv").config();
module.exports = (req, res, next) => {
  // const token = req.cookies.token
  const token = req.headers.authorization;
  //   console.log("token in restricted-------->", token);
  // see if there is a token
  //check if it is valid
  //reash the header + payload + secrete and see if it matches our verify signature
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        // console.log("err in verify token middleware----->", err);
        res.status(401).json("token invalid");
      } else {
        //token is valid here
        req.decodedToken = decodedToken;
        next();
      }
    });
  } else {
    res.status(400).json("token required");
  }
};
