const express = require("express");
const {
  createUser,
  getUserById,
  getUsers,
  updateUser,
  deleteUser,
  createRole,
  forgotPassword,
} = require("../controllers/userController");
const { login, logout } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/authorizeRole");

const router = express.Router();

router.post("/login", login);

// Rute untuk logout
router.post("/logout", authMiddleware, logout);

router.post("/reset", forgotPassword);

// Rute yang memerlukan autentikasi
router.get("/protected", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Protected route accessed", user: req.user });
});

router.get("/user", getUsers);
router.get("/user/:id", getUserById);
router.post(
  "/user",
  // authMiddleware,
  // authorizeRole(["super_admin", "admin"]),
  createUser
);
router.put(
  "/user/:id",
  // authMiddleware,
  // authorizeRole(["super_admin", "admin"]),
  updateUser
);
router.delete(
  "/user/:id",
  // authMiddleware,
  // authorizeRole(["super_admin"]),
  deleteUser
);

router.post("/role", createRole);

module.exports = router;
