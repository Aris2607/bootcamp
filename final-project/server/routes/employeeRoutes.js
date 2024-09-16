const express = require("express");
const {
  create,
  getAll,
  getById,
  updateEmployee,
  deleteEmployee,
  getByName,
  getEmployee,
  searchEmployee,
} = require("../controllers/employeeController");
const {
  validateEmployeeCreation,
  validateEmployeeUpdate,
} = require("../validations/employeeValidation");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerConfig"); // Import konfigurasi multer
const { uploadFile } = require("../controllers/uploadController"); // Import controller

const router = express.Router();
//wallpapercave.com/w/wp8281609
// Definisikan route untuk upload
https: router.post("/upload", upload.single("profile_picture"), uploadFile);

router.post("/employee/search", searchEmployee);
router.get("/employee", getEmployee);
router.get("/employees", getAll);
router.get("/employee/:id", getById);
router.post(
  "/employee",
  (req, res, next) => {
    console.log("Request Body in Route:", req.body);
    next();
  },
  // authMiddleware,
  validateEmployeeCreation,
  create
);
router.put("/employee/:id", validateEmployeeUpdate, updateEmployee);
router.delete("/employee/:id", deleteEmployee);

module.exports = router;
