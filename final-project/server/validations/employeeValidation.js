const { check } = require("express-validator");

const validateEmployeeCreation = [
  check("first_name").notEmpty().withMessage("First name is required"),
  check("last_name").notEmpty().withMessage("Last name is required"),
  check("positionId")
    .isInt({ min: 1 })
    .withMessage("Valid positionId is required"),
  check("departmentId")
    .isInt({ min: 1 })
    .withMessage("Valid departmentId is required"),
];

const validateEmployeeUpdate = [
  check("first_name")
    .optional()
    .notEmpty()
    .withMessage("First name cannot be empty"),
  check("last_name")
    .optional()
    .notEmpty()
    .withMessage("Last name cannot be empty"),
  check("positionId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Valid positionId is required"),
  check("departmentId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Valid departmentId is required"),
];

module.exports = {
  validateEmployeeCreation,
  validateEmployeeUpdate,
};
