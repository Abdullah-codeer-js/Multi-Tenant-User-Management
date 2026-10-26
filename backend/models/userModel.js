module.exports = {
  tableName: "users",
  fields: {
    id: "SERIAL PRIMARY KEY",
    company_id: "INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE",
    name: "VARCHAR(255) NOT NULL",
    email: "VARCHAR(255) NOT NULL",
    password_hash: "TEXT NOT NULL",
    role: "VARCHAR(20) NOT NULL CHECK (role IN ('Admin', 'Manager', 'Employee'))",
    created_at: "TIMESTAMPTZ NOT NULL DEFAULT NOW()",
    updated_at: "TIMESTAMPTZ NOT NULL DEFAULT NOW()",
    deleted_at: "TIMESTAMPTZ NULL",
  },
};
