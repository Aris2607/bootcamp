// controllers/authController.js

const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { generateAuthToken } = require("../utils/auth");
require("dotenv").config();

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateAuthToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: "production",
      maxAge: 3600000,
    });

    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to login" });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to logout" });
  }
};

module.exports = { login, logout };
