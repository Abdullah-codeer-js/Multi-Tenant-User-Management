const pool = require("../config/db");

async function createUser({ company_id, name, email, password_hash, role }) {
  const result = await pool.query(
    `INSERT INTO users (company_id, name, email, password_hash, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, company_id, name, email, role, created_at, updated_at`,
    [company_id, name, email, password_hash, role]
  );

  return result.rows[0];
}

async function getUserById(id, companyId = null) {
  let query = `
    SELECT id, company_id, name, email, role, created_at, updated_at
    FROM users
    WHERE id = $1 AND deleted_at IS NULL`;

  const params = [id];

  if (companyId) {
    query += ` AND company_id = $2`;
    params.push(companyId);
  }

  const result = await pool.query(query, params);
  return result.rows[0] || null;
}

async function getUserByEmailInCompany(companyId, email) {
  const result = await pool.query(
    `SELECT id, company_id, name, email, password_hash, role, created_at, updated_at
     FROM users
     WHERE company_id = $1
       AND LOWER(email) = LOWER($2)
       AND deleted_at IS NULL`,
    [companyId, email]
  );

  return result.rows[0] || null;
}

async function findByEmailAndSubdomain({ email, subdomain }) {
  const result = await pool.query(
    `SELECT u.id, u.company_id, u.name, u.email, u.password_hash, u.role,
            u.created_at, u.updated_at, c.subdomain
     FROM users u
     JOIN companies c ON c.id = u.company_id
     WHERE LOWER(u.email) = LOWER($1)
       AND LOWER(c.subdomain) = LOWER($2)
       AND u.deleted_at IS NULL
       AND c.deleted_at IS NULL`,
    [email, subdomain]
  );

  return result.rows[0] || null;
}

async function getUsersByCompany(companyId) {
  const result = await pool.query(
    `SELECT id, company_id, name, email, role, created_at, updated_at
     FROM users
     WHERE company_id = $1 AND deleted_at IS NULL
     ORDER BY created_at DESC`,
    [companyId]
  );

  return result.rows;
}

async function updateUser(id, companyId, updates) {
  const keys = Object.keys(updates);
  const columns = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
  const params = keys.map((key) => updates[key]);
  params.push(id, companyId);

  const result = await pool.query(
    `UPDATE users
     SET ${columns}, updated_at = NOW()
     WHERE id = $${keys.length + 1}
       AND company_id = $${keys.length + 2}
       AND deleted_at IS NULL
     RETURNING id, company_id, name, email, role, created_at, updated_at`,
    params
  );

  return result.rows[0] || null;
}

async function softDeleteUser(id, companyId) {
  const result = await pool.query(
    `UPDATE users
     SET deleted_at = NOW(), updated_at = NOW()
     WHERE id = $1 AND company_id = $2 AND deleted_at IS NULL
     RETURNING id, company_id, name, email, role`,
    [id, companyId]
  );

  return result.rows[0] || null;
}

module.exports = {
  createUser,
  getUserById,
  getUserByEmailInCompany,
  findByEmailAndSubdomain,
  getUsersByCompany,
  updateUser,
  softDeleteUser,
};
