const pool = require("../config/db");
const { ADMIN } = require("../constants/roles");
const { CONFLICT, BAD_REQUEST } = require("../constants/httpStatus");
const { COMPANY, VALIDATION } = require("../constants/message");
const ApiError = require("../utils/ApiError");
const { hashPassword } = require("../utils/password");
const companyRepository = require("../repositories/companyRepository");
const userRepository = require("../repositories/userRepository");

function normalizeSubdomain(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function validateSubdomain(subdomain) {
  if (!subdomain) {
    throw new ApiError(BAD_REQUEST, VALIDATION.INVALID_SUBDOMAIN);
  }

  if (!/^[a-z0-9-]+$/.test(subdomain) || subdomain.includes("--")) {
    throw new ApiError(BAD_REQUEST, VALIDATION.INVALID_SUBDOMAIN);
  }

  const reserved = ["admin", "api", "www", "login", "dashboard", "app"];
  if (reserved.includes(subdomain)) {
    throw new ApiError(BAD_REQUEST, VALIDATION.INVALID_SUBDOMAIN);
  }
}

async function registerCompany(payload) {
  const { companyName, subdomain, fullName, email, password, passwordConfirmation } = payload;

  if (!companyName || !fullName || !email || !password) {
    throw new ApiError(BAD_REQUEST, "Company name, admin name, email, and password are required.");
  }

  if (password.length < 8) {
    throw new ApiError(BAD_REQUEST, VALIDATION.WEAK_PASSWORD);
  }

  if (password !== passwordConfirmation) {
    throw new ApiError(BAD_REQUEST, VALIDATION.PASSWORD_MISMATCH);
  }

  const normalizedSubdomain = normalizeSubdomain(subdomain);
  validateSubdomain(normalizedSubdomain);
  const normalizedEmail = normalizeEmail(email);

  const existingCompany = await companyRepository.getCompanyBySubdomain(normalizedSubdomain);
  if (existingCompany) {
    throw new ApiError(CONFLICT, COMPANY.DUPLICATE_SUBDOMAIN);
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const companyResult = await client.query(
      `INSERT INTO companies (name, subdomain)
       VALUES ($1, $2)
       RETURNING id, name, subdomain, created_at, updated_at`,
      [companyName.trim(), normalizedSubdomain]
    );

    const company = companyResult.rows[0];
    const passwordHash = await hashPassword(password);

    const userResult = await client.query(
      `INSERT INTO users (company_id, name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, company_id, name, email, role, created_at`,
      [company.id, fullName.trim(), normalizedEmail, passwordHash, ADMIN]
    );

    await client.query("COMMIT");

    return {
      company,
      user: userResult.rows[0],
      message: COMPANY.CREATED,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function getCompanyProfile(companyId) {
  return companyRepository.getCompanyById(companyId);
}

async function listCompanies() {
  return companyRepository.listCompanies();
}

module.exports = {
  registerCompany,
  getCompanyProfile,
  listCompanies,
};
