const express = require("express");
const {
  createUser,
  getUserById,
  getUsers,
  updateUser,
  deleteUser,
  forgotPassword,
  sendCreatePasswordUser,
  createPassword,
  getChats,
  getUserByDivision,
  changePassword,
} = require("../controllers/userController");
const {
  login,
  logout,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createRole,
  getRolesAndPermit,
  getAllRolesAndPermit,
  updatePermit,
} = require("../controllers/roleController");
const { getNotifications } = require("../controllers/notificationController");

const router = express.Router();

router.post("/login", login);

// Rute untuk logout
router.post("/logout", logout);

router.post("/request-password-reset", requestPasswordReset);

router.post("/reset-password", resetPassword);

router.post("/change-password/:id", changePassword);

router.post("/send-create-password", sendCreatePasswordUser);

router.post("/create-password", createPassword);

router.get("/roles/get/all", getAllRolesAndPermit);

router.get("/roles/get", getRolesAndPermit);

router.post("/roles/update-permit/:roleId", updatePermit);

router.post("/roles/create", createRole);

router.get("/user/notification/:employeeId", getNotifications);

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

// router.post("/role", createRole);

router.post("/chat/all", getChats);

module.exports = router;
