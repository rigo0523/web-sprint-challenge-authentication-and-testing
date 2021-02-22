require("dotenv").config();
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isValid } = require("../../users/users-service");
//Users in DB
const User = require("../../users/users-model");

//POST /api/auth/register
router.post("/register", (req, res, next) => {
  const credentials = req.body;
  //validate credentials, can be added as a middleware too
  if (!credentials) {
    res.status(400).json({ message: "username and password required...." });
  }

  //is valid from users/users-service.js which makes sure we input username
  //and password otherwise we get an error
  if (isValid(credentials)) {
    //hashed password into user.password
    const hashedPassword = bcrypt.hashSync(credentials.password, 10);
    credentials.password = hashedPassword;
    //adds the username and password with hashedpassword now
    User.add(credentials)
      .then((newUser) => {
        //Generate token into password now
        //add token to the user, use that token for authorized restricted
        //endpoins
        // const token = generateToken(newUser);
        //adding token as a response causes my tests to fail, leaving out.....
        if (newUser) {
          res.status(201).json(newUser);
        } else {
          res.status(404).json({ message: `${newUser.username} taken` });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: `${credentials.username} taken` });
      });
  } else {
    res.status(400).json({
      message: "username and password required",
    });
  }
});

//POST /api/auth/login
router.post("/login", (req, res, next) => {
  const credentials = req.body;

  //is valid from users/users-service.js which makes sure we input username
  //and password otherwise we get an error
  if (isValid(credentials)) {
    User.findBy({ username: credentials.username })
      .then((user) => {
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          // add TOKEN
          //add token to the user, use that token for authorized restricted
          //endpoins
          const token = generateToken(user);
          res.status(200).json({
            message: `welcome ${user.username}, have a cookie`,
            token,
          });
        } else {
          res.status(401).json({ message: `invalid credentials` });
        }
      })
      .catch((err) => {
        next(err);
      });
  } else {
    res.status(400).json({
      message: "username and password required",
    });
  }
});

//GENERATE A TOKEN and apply to register and login
function generateToken(user) {
  //payload
  const payload = {
    subID: user.id,
    username: user.username,
  };
  //options
  const options = {
    expiresIn: "1h",
  };
  //return jwt.sign
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

module.exports = router;
