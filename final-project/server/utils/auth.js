const jwt = require("jsonwebtoken");
require("dotenv").config();

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

const generateAuthToken = (user) => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment");
  }
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

module.exports = { generateAuthToken };
