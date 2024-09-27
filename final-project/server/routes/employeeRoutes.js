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
  createEmployeeSchedule,
  createEmployeeBatch,
} = require("../controllers/employeeController");
const {
  validateEmployeeCreation,
  validateEmployeeUpdate,
} = require("../validations/employeeValidation");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerConfig"); // Import konfigurasi multer
const fileUpload = require("../middlewares/multerFileConfig.js");
const {
  uploadFile,
  uploadFileExcel,
} = require("../controllers/uploadController"); // Import controller
const { getDepartments } = require("../controllers/departmentController");
const {
  getPositionsByDepartment,
} = require("../controllers/departmentController");

const router = express.Router();
//wallpapercave.com/w/wp8281609
// Definisikan route untuk upload
router.post("/upload", upload.single("profile_picture"), uploadFile);

router.post("/upload/file", fileUpload.single("file"), uploadFileExcel);

router.post("/employees/batch", validateEmployeeCreation, createEmployeeBatch);

router.post("/employee/:role_id/search", searchEmployee);
router.get("/employees/:role_id", getEmployee);
router.get("/employees", getAll);
router.get("/employee/:id", getById);
router.post(
  "/employee",
  (req, res, next) => {
    console.log("Request Body in Route:", req.body);
    next();
  },
  // authMiddleware,
  // validateEmployeeCreation,
  create
);
router.get("/departments", getDepartments);
router.get("/positions", getPositionsByDepartment);
router.post("/employee/schedule", createEmployeeSchedule);
router.put("/employee/:id/edit", validateEmployeeUpdate, updateEmployee);
router.delete("/employee/:id", deleteEmployee);

module.exports = router;
