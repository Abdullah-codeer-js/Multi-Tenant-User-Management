const pool = require("../config/db");

async function createCompany({ name, subdomain }) {
  const result = await pool.query(
    `INSERT INTO companies (name, subdomain)
     VALUES ($1, $2)
     RETURNING id, name, subdomain, created_at, updated_at, deleted_at`,
    [name, subdomain]
  );

  return result.rows[0];
}

async function getCompanyById(id) {
  const result = await pool.query(
    `SELECT id, name, subdomain, created_at, updated_at, deleted_at
     FROM companies
     WHERE id = $1 AND deleted_at IS NULL`,
    [id]
  );

  return result.rows[0] || null;
}

async function getCompanyBySubdomain(subdomain) {
  const result = await pool.query(
    `SELECT id, name, subdomain, created_at, updated_at, deleted_at
     FROM companies
     WHERE LOWER(subdomain) = LOWER($1)
       AND deleted_at IS NULL`,
    [subdomain]
  );

  return result.rows[0] || null;
}

async function listCompanies() {
  const result = await pool.query(
    `SELECT id, name, subdomain, created_at, updated_at
     FROM companies
     WHERE deleted_at IS NULL
     ORDER BY created_at DESC`
  );

  return result.rows;
}

module.exports = {
  createCompany,
  getCompanyById,
  getCompanyBySubdomain,
  listCompanies,
};
