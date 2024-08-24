const express = require("express");
const {
  create,
  getAll,
  getById,
  updateEmployee,
  deleteEmployee,
  getByName,
} = require("../controllers/employeeController");
const {
  validateEmployeeCreation,
  validateEmployeeUpdate,
} = require("../validations/employeeValidation");

const router = express.Router();

router.get("/employee/search", getByName);
router.get("/employee", getAll);
router.get("/employee/:id", getById);
router.post(
  "/employee",
  (req, res, next) => {
    console.log("Request Body in Route:", req.body);
    next();
  },
  validateEmployeeCreation,
  create
);
router.put("/employee/:id", validateEmployeeUpdate, updateEmployee);
router.delete("/employee/:id", deleteEmployee);

module.exports = router;
