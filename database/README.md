# Database setup

1. Create a PostgreSQL database named `MTUS_db` (or update the values in `backend/.env`).
2. Connect to PostgreSQL with a user that has permission to create tables.
3. Run the migration:

```bash
psql -h localhost -U postgres -d MTUS_db -f database/migrations/001_create_tenant_schema.sql
```

4. If you use a different database name or credentials, update the `backend/.env` values before starting the API.

This migration is safe to run more than once because it uses `IF NOT EXISTS` and `CREATE UNIQUE INDEX IF NOT EXISTS`.
