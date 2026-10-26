module.exports = {
  tableName: "companies",
  fields: {
    id: "SERIAL PRIMARY KEY",
    name: "VARCHAR(255) NOT NULL",
    subdomain: "VARCHAR(100) NOT NULL UNIQUE",
    created_at: "TIMESTAMPTZ NOT NULL DEFAULT NOW()",
    updated_at: "TIMESTAMPTZ NOT NULL DEFAULT NOW()",
    deleted_at: "TIMESTAMPTZ NULL",
  },
};
