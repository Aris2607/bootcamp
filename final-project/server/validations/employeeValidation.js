const { check } = require("express-validator");

const validateEmployeeCreation = [
  check("first_name").notEmpty().withMessage("First name is required"),
  check("last_name").notEmpty().withMessage("Last name is required"),
  check("phone_number")
    .isMobilePhone("id-ID")
    .withMessage("Mobile Phone not Valid"),
  check("position_id")
    .isInt({ min: 1 })
    .withMessage("Valid positionId is required"),
  check("department_id")
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
  check("position_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Valid positionId is required"),
  check("department_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Valid departmentId is required"),
];

module.exports = {
  validateEmployeeCreation,
  validateEmployeeUpdate,
};
