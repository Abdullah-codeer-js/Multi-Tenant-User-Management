const { body } = require("express-validator");

const registerRules = [
  body("companyName").trim().isLength({ min: 2 }).withMessage("Company name is required."),
  body("subdomain").trim().matches(/^[a-z0-9-]+$/).withMessage("Subdomain format is invalid."),
  body("fullName").trim().isLength({ min: 2 }).withMessage("Full name is required."),
  body("email").isEmail().withMessage("A valid email is required."),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long."),
];

const loginRules = [
  body("email").isEmail().withMessage("A valid email is required."),
  body("password").notEmpty().withMessage("Password is required."),
  body("subdomain").trim().notEmpty().withMessage("Subdomain is required."),
];

module.exports = {
  registerRules,
  loginRules,
};
