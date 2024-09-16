// controllers/authController.js
const { Users, Employees, Roles } = require("../models");
const bcrypt = require("bcrypt");
const { generateAuthToken } = require("../utils/auth");
const sgMail = require("@sendgrid/mail");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findOne({
      where: { username },
      include: [
        {
          model: Employees,
          attributes: [
            "first_name",
            "last_name",
            "email",
            "division_id",
            "profile_picture",
          ],
        },
        {
          model: Roles,
          attributes: ["role_name"],
        },
      ],
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateAuthToken(user);

    res.cookie("token", token, {
      httpOnly: false,
      secure: true,
      maxAge: 3600000,
      path: "/",
      domain: ".asse.devtunnels.ms",
      sameSite: "None",
    });

    user.status = "Online";
    await user.save();

    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to login" });
  }
};

const logout = async (req, res) => {
  const { username } = req.body;
  try {
    const user = await Users.findOne({
      where: { username },
    });

    if (!user) {
      res.status(404).json({ message: "Not Found" });
    }

    user.status = "Offline";

    await user.save();

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

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  sgMail.setApiKey(process.env.SENDGRID_APIKEY);

  console.log("Email:", email);

  try {
    // Cari employee berdasarkan email
    const employee = await Employees.findOne({
      where: { email },
      include: {
        model: Users, // Include data dari tabel Users
        required: true, // Join bersifat inner join, mengharuskan ada kecocokan di tabel Users
        attributes: ["id", "username", "employee_id"], // Pilih atribut yang dibutuhkan
      },
    });

    console.log("Employee data:", employee);

    if (!employee) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Ambil data pengguna dari hasil pencarian
    const user = employee.User; // Ambil objek User yang di-include di atas

    // Membuat token reset password menggunakan JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token kedaluwarsa dalam 1 jam
    });

    // URL untuk halaman reset password
    const resetLink = `http://10.10.101.187:5173/reset-password?token=${token}`;

    // Kirim email ke pengguna dengan tautan reset password menggunakan SendGrid
    const msg = {
      to: email, // Email tujuan adalah email dari tabel Employees
      from: "ars.hsrps@gmail.com", // Email pengirim
      subject: "Password Reset Request",
      html: `
        <p>You requested for a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    };

    await sgMail.send(msg);

    res.json({ message: "Password reset link has been sent to your email." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong. Unable to send email" });
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body; // Ambil token dan password baru dari body

  console.log("Received token:", token);
  console.log("Received newPassword:", password);

  if (!token || !password) {
    return res
      .status(400)
      .json({ message: "Token and new password are required." });
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Temukan pengguna berdasarkan ID
    const user = await Users.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Enkripsi password baru
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Update password di database
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({ message: "Invalid or expired token." });
  }
};

module.exports = { login, logout, requestPasswordReset, resetPassword };
