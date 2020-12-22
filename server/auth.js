const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { parsed: { JWT_SECRET = "" } = {}} = require('dotenv').config();
const secret = JWT_SECRET || process.env.JWT_SECRET;

if (!secret) {
  console.log("You need to define a JWT_SECRET environment variable to continue.");
  mongoose.connection.close();
  process.exit();
}

// Generate a token
const generateToken = (data, expires) => {
  return jwt.sign(data, secret, {
    expiresIn: expires
  });
};

// Verify the token that a client gives us.
// This is setup as middleware, so it can be passed as an additional argument to Express after
// the URL in any route. This will restrict access to only those clients who possess a valid token.
const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies["token"];
    if (!token) return res.status(403).send({
      message: "No token provided."
    });
    const decoded = jwt.verify(token, secret);
    // save user id
    req.user_id = decoded.id;
    req.token = token;
    next();

  } catch (error) {
    console.log(error);
    return res.status(403).send({
      message: "Failed to authenticate token."
    });
  }
}

const removeOldTokens = (tokens) => {
  return tokens.filter(token => {
    try {
      jwt.verify(token, secret);
      return true;
    } catch (error) {
      return false;
    }
  });
}

module.exports = {
  generateToken,
  verifyToken,
  removeOldTokens
};
