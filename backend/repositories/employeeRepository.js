const pool = require("../config/db");

async function createEmployee({ company_id, user_id, employee_code, department, job_title, phone, joining_date }) {
  const result = await pool.query(
    `INSERT INTO employees (
      company_id, user_id, employee_code, department, job_title, phone, joining_date
     ) VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, company_id, user_id, employee_code, department, job_title, phone, joining_date, created_at, updated_at`,
    [company_id, user_id, employee_code, department, job_title, phone, joining_date]
  );

  return result.rows[0];
}

async function getEmployeesByCompany(companyId) {
  const result = await pool.query(
    `SELECT id, company_id, user_id, employee_code, department, job_title, phone, joining_date, created_at, updated_at
     FROM employees
     WHERE company_id = $1 AND deleted_at IS NULL
     ORDER BY created_at DESC`,
    [companyId]
  );

  return result.rows;
}

async function getEmployeeById(id, companyId) {
  const result = await pool.query(
    `SELECT id, company_id, user_id, employee_code, department, job_title, phone, joining_date, created_at, updated_at
     FROM employees
     WHERE id = $1 AND company_id = $2 AND deleted_at IS NULL`,
    [id, companyId]
  );

  return result.rows[0] || null;
}

async function getEmployeeByCodeInCompany(companyId, employeeCode) {
  const result = await pool.query(
    `SELECT id, company_id, user_id, employee_code, department, job_title, phone, joining_date, created_at, updated_at
     FROM employees
     WHERE company_id = $1
       AND LOWER(employee_code) = LOWER($2)
       AND deleted_at IS NULL`,
    [companyId, employeeCode]
  );

  return result.rows[0] || null;
}

async function updateEmployee(id, companyId, updates) {
  const keys = Object.keys(updates);
  const assignments = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
  const params = [...keys.map((key) => updates[key]), id, companyId];

  const result = await pool.query(
    `UPDATE employees
     SET ${assignments}, updated_at = NOW()
     WHERE id = $${keys.length + 1} AND company_id = $${keys.length + 2} AND deleted_at IS NULL
     RETURNING id, company_id, user_id, employee_code, department, job_title, phone, joining_date, created_at, updated_at`,
    params
  );

  return result.rows[0] || null;
}

async function softDeleteEmployee(id, companyId) {
  const result = await pool.query(
    `UPDATE employees
     SET deleted_at = NOW(), updated_at = NOW()
     WHERE id = $1 AND company_id = $2 AND deleted_at IS NULL
     RETURNING id, company_id, employee_code`,
    [id, companyId]
  );

  return result.rows[0] || null;
}

module.exports = {
  createEmployee,
  getEmployeesByCompany,
  getEmployeeById,
  getEmployeeByCodeInCompany,
  updateEmployee,
  softDeleteEmployee,
};
