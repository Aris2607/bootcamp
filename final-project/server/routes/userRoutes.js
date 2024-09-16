const express = require("express");
const {
  createUser,
  getUserById,
  getUsers,
  updateUser,
  deleteUser,
  createRole,
  forgotPassword,
  sendCreatePasswordUser,
  createPassword,
  getChats,
  getUserByDivision,
} = require("../controllers/userController");
const {
  login,
  logout,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", login);

// Rute untuk logout
router.post("/logout", authMiddleware, logout);

router.post("/request-password-reset", requestPasswordReset);

router.post("/reset-password", resetPassword);

router.post("/send-create-password", sendCreatePasswordUser);

router.post("/create-password", createPassword);

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
router.post("/user/division/get", getUserByDivision);
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

router.post("/chat/all", getChats);

module.exports = router;
