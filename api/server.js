const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

//restricted middleware for dad jokes
const restrict = require("./middleware/restricted.js");

//routers
const authRouter = require("./auth/auth-router.js");
const jokesRouter = require("./jokes/jokes-router.js");
const usersRouter = require("../users/users-router");

//server
const server = express();

//global middleware
server.use(helmet());
server.use(cors());
server.use(express.json());

///Server ENDPOINTS ------->
server.use("/api/auth", authRouter);
server.use("/api/users", usersRouter);
server.use("/api/jokes", restrict, jokesRouter); // only logged-in users should have access!

//global middleware for catch 500 error.....
server.use((err, req, res, next) => {
  // console.log("505 error----->", err);
  res.status(500).json({ Error: "500 Error, what happened?" });
});

module.exports = server;

//all tests are working, codegrade not detecting all of them are passing
