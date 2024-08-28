const { Users, Employees, Roles } = require("../models");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();

const createUser = async (req, res) => {
  try {
    const { employee_id, username, password, role_id } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);

    console.log(hashedPassword);
    const user = await Users.create({
      employee_id,
      username,
      password: hashedPassword,
      role_id,
    });
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to Create User" });
  }
};

const getUsers = async (req, res) => {
  try {
    const user = await Users.findAll({
      include: [
        {
          model: Employees,
          attributes: ["email"],
        },
        {
          model: Roles,
          attributes: ["role_name"],
        },
      ],
    });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to Fetch User" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await Users.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not Found" });
    }
    res.status(200).json({ data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to Fetch User" });
  }
};

const getUserByUsername = async (req, res) => {
  try {
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to find user" });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await Users.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not Found" });
    }
    await Users.update(req.body, { where: { id: req.params.id } });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to Update User" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await Users.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not Found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to Delete User" });
  }
};

const createRole = async (req, res) => {
  try {
    const role = await Roles.create(req.body);
    res.status(201).json(role);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to create role" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    // Initialize OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "http://localhost" // Redirect URL for testing
    );

    // Set credentials for the OAuth2 client
    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    console.log("Client ID:", process.env.CLIENT_ID);
console.log("Client Secret:", process.env.CLIENT_SECRET);
console.log("Refresh Token:", process.env.REFRESH_TOKEN);


    // Generate access token
    const accessToken = await oauth2Client.getAccessToken();

    // Create transporter object using OAuth2
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "mochamad11aris@gmail.com",
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token, // Use generated access token
      },
    });

    // Mail options
    const mailOptions = {
      from: "mochamad11aris@gmail.com",
      to: req.body.email,
      subject: "Test Email",
      text: "This is a test email sent using OAuth2",
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Unable to send email" });
      }
      console.log("Email sent:", info.response);
      res.status(200).json({ data: "Berhasil" });
    });
  } catch (err) {
    console.error("Error in forgotPassword function:", err);
    res.status(500).json({ error: "Unable to reset password" });
  }
};
module.exports = {
  createUser,
  getUsers,
  getUserById,
  getUserByUsername,
  updateUser,
  deleteUser,
  createRole,
  forgotPassword,
};
