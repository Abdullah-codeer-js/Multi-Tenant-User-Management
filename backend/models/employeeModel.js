module.exports = {
  tableName: "employees",
  fields: {
    id: "SERIAL PRIMARY KEY",
    company_id: "INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE",
    user_id: "INTEGER NULL REFERENCES users(id) ON DELETE SET NULL",
    employee_code: "VARCHAR(100) NOT NULL",
    department: "VARCHAR(150) NOT NULL",
    job_title: "VARCHAR(150) NOT NULL",
    phone: "VARCHAR(50) NULL",
    joining_date: "DATE NOT NULL",
    created_at: "TIMESTAMPTZ NOT NULL DEFAULT NOW()",
    updated_at: "TIMESTAMPTZ NOT NULL DEFAULT NOW()",
    deleted_at: "TIMESTAMPTZ NULL",
  },
};
