const { body } = require("express-validator");

const userRules = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name is required."),
  body("email").isEmail().withMessage("A valid email is required."),
  body("role").isIn(["Admin", "Manager", "Employee"]).withMessage("Role is invalid."),
];

module.exports = { userRules };
