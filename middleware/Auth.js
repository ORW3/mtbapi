const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Usuario = require("../models/Usuario");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await Usuario.findById(decodedToken.id).select("-contrasena");
      next();
    } catch (err) {
      console.log(err);
      res.status(401).json({ message: "Token not valid" });
    }
  } else {
    res.status(401);
    throw new Error("Not authorized!");
  }
});

module.exports = protect;
