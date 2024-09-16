const { Users, Employees, Roles, Chats } = require("../models");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const sgMail = require("@sendgrid/mail");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const createUser = async (req, res) => {
  try {
    const { employee_id, username, password, role_id } = req.body;

    if (password) {
      var hashedPassword = bcrypt.hashSync(password, 10);
    }

    console.log(hashedPassword);
    const user = await Users.create({
      employee_id,
      username,
      password: hashedPassword || null,
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

const getUserByDivision = async (req, res) => {
  const { division_id } = req.body;

  console.log("DIVISION ID:", division_id);

  try {
    const user = await Users.findAll({
      include: {
        model: Employees,
        attribute: ["division_id", "profile_picture"],
        where: {
          division_id,
        },
      },
    });

    console.log("USERSSS:", user);

    if (user.length == 0) {
      return res
        .status(404)
        .json({ message: "There's no user in the division" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch user" });
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

// const forgotPassword = async (req, res) => {
//   try {
//     // Initialize OAuth2 client
//     const oauth2Client = new google.auth.OAuth2(
//       process.env.CLIENT_ID,
//       process.env.CLIENT_SECRET,
//       "http://localhost" // Redirect URL for testing
//     );

//     // Set credentials for the OAuth2 client
//     oauth2Client.setCredentials({
//       refresh_token: process.env.REFRESH_TOKEN,
//     });

//     console.log("Client ID:", process.env.CLIENT_ID);
//     console.log("Client Secret:", process.env.CLIENT_SECRET);
//     console.log("Refresh Token:", process.env.REFRESH_TOKEN);

//     // Generate access token
//     const accessToken = await oauth2Client.getAccessToken();

//     // Create transporter object using OAuth2
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         type: "OAuth2",
//         user: "mochamad11aris@gmail.com",
//         clientId: process.env.CLIENT_ID,
//         clientSecret: process.env.CLIENT_SECRET,
//         refreshToken: process.env.REFRESH_TOKEN,
//         accessToken: accessToken.token, // Use generated access token
//       },
//     });

//     // Mail options
//     const mailOptions = {
//       from: "mochamad11aris@gmail.com",
//       to: req.body.email,
//       subject: "Test Email",
//       text: "This is a test email sent using OAuth2",
//     };

//     // Send email
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error("Error sending email:", error);
//         return res.status(500).json({ error: "Unable to send email" });
//       }
//       console.log("Email sent:", info.response);
//       res.status(200).json({ data: "Berhasil" });
//     });
//   } catch (err) {
//     console.error("Error in forgotPassword function:", err);
//     res.status(500).json({ error: "Unable to reset password" });
//   }
// };

const forgotPassword = async (req, res) => {
  sgMail.setApiKey(process.env.SENDGRID_APIKEY);

  const msg = {
    to: req.body.email,
    from: "ars.hsrps@gmail.com", // Use the email address or domain you verified above
    subject: "Sending with Twilio SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ success: "Email send successful" });
  } catch (error) {
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
};

const sendCreatePasswordUser = async (req, res) => {
  const { email, username } = req.body;
  sgMail.setApiKey(process.env.SENDGRID_APIKEY);

  try {
    // Cari employee berdasarkan email
    const user = await Users.findOne({
      where: { username },
    });

    console.log("Email:", email);
    console.log("Username:", username);
    console.log("User Data:", user);

    // if (!user) {
    //   return res.status(404).json({ message: "Email not found" });
    // }

    // Ambil data pengguna dari hasil pencarian
    // const employee = user.Employees; // Ambil objek User yang di-include di atas

    // Membuat token reset password menggunakan JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "23h", // Token kedaluwarsa dalam 1 jam
    });

    // URL untuk halaman reset password
    const sendLink = `http://10.10.101.187:5173/create-password?token=${token}`;

    // Kirim email ke pengguna dengan tautan reset password menggunakan SendGrid
    const msg = {
      to: email, // Email tujuan adalah email dari tabel Employees
      from: "ars.hsrps@gmail.com", // Email pengirim
      subject: "Create User Password Account",
      html: `
        <p>You has registered for ARS Attendance. Click the link below to create your password:</p>
        <p>Your Username is: ${username}</p>
        <a href="${sendLink}">${sendLink}</a>
      `,
    };

    await sgMail.send(msg);

    res.json({ message: "Password create link has been sent to your email." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong. Unable to send email" });
  }
};

const createPassword = async (req, res) => {
  const { password, token } = req.body;

  console.log("Password:", password);
  console.log("Token:", token);
  console.log("Token in body:", req.body.token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await Users.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password has been set successfully" });
  } catch (err) {
    console.error("Error during set password:", err);
    res.status(500).json({ message: "Invalid or expired token." });
  }
};

const getChats = async (req, res) => {
  const { division_id } = req.body;

  console.log("Received request for chats with division_id:", division_id); // Debugging log

  if (!division_id) {
    return res.status(400).json({ message: "division_id is required" }); // Return early if division_id is missing
  }

  try {
    const chat = await Chats.findAll({
      where: {
        division_id,
      },
      include: {
        model: Users,
        attribute: ["username"],
        include: {
          model: Employees,
          attribute: ["profile_picture"],
        },
      },
    });

    console.log("Chat retrieved from database:", chat); // Debugging log

    if (chat.length === 0) {
      // Corrected check for empty result
      return res.status(404).json({ message: "There's no chat available" }); // Added return
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error("Error retrieving chats:", error); // Log the error with details
    res.status(500).json({ message: "Unable to retrieve chats" });
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
  sendCreatePasswordUser,
  createPassword,
  getChats,
  getUserByDivision,
};
