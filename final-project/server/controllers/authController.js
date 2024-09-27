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
      secure: false,
      maxAge: 3600000,
      path: "/",
      domain: ".asse.devtunnels.ms",
      sameSite: "Lax",
    });

    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to login" });
  }
};

const logout = async (req, res) => {
  try {
    console.log("Token:", req.cookies.token);

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    console.log("Header Token:", token);

    res.clearCookie("token", {
      httpOnly: false, // Matches the httpOnly setting from login
      secure: false, // Matches the secure setting from login
      sameSite: "Lax", // Matches the SameSite setting from login
      path: "/", // Make sure the path matches as well
      domain: ".asse.devtunnels.ms",
    });

    // localStorage.removeItem("token");

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
      expiresIn: "30m", // Token kedaluwarsa dalam 30 menit
    });

    // URL untuk halaman reset password
    const resetLink = `https://bhf9dmsr-5173.asse.devtunnels.ms/reset-password?token=${token}`;

    // Kirim email ke pengguna dengan tautan reset password menggunakan SendGrid
    const msg = {
      to: email, // Email tujuan adalah email dari tabel Employees
      from: "ars.hsrps@gmail.com", // Email pengirim
      subject: "Reset Your ARS Office Attendance Account Password",
      html: `
    <p>Dear ${employee.first_name} ${employee.last_name},</p>
    <p>We received a request to reset the password for your ARS Office Attendance account.</p>
    <p>If you requested this, please click the link below to reset your password:</p>
    <p><a href="${resetLink}" style="color: #007bff; text-decoration: none;">Reset Your Password</a></p>
    <p>If you did not request a password reset, please ignore this email or contact our support team for assistance.</p>
    <p>For your security, the link will expire in 30 minutes.</p>
    <p>Best regards,</p>
    <p><strong>ARS Office Team</strong></p>
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
