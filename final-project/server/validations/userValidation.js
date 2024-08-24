const { check, validationResult } = require("express-validator");

const validateUserCreation = [
  check("username").notEmpty().withMessage("Username is required"),
  check("email").isEmail().withMessage("Valid email is required"),
  check("roleId").isInt({ min: 1 }).withMessage("Valid roleId is required"),
];

const validateUserUpdate = [
  check("username")
    .optional()
    .notEmpty()
    .withMessage("Username cannot be empty"),
  check("email").optional().isEmail().withMessage("Valid email is required"),
  check("roleId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Valid roleId is required"),
];

module.exports = {
  validateUserCreation,
  validateUserUpdate,
};
