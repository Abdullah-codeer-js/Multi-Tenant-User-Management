const { body } = require("express-validator");

const companyRules = [
  body("companyName").trim().isLength({ min: 2 }).withMessage("Company name is required."),
  body("subdomain").trim().matches(/^[a-z0-9-]+$/).withMessage("Subdomain format is invalid."),
  body("email").isEmail().withMessage("A valid email is required."),
];

module.exports = { companyRules };
