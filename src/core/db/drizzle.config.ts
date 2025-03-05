import { defineConfig, Config } from 'drizzle-kit';
require('dotenv').config();

export default defineConfig({
  schema: 'src/core/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_URL,
  },
  verbose: true,
  strict: true,
  migrations: {
    table: '__drizzle_migrations', // default `__drizzle_migrations`,
    schema: 'public', // used in PostgreSQL only and default to `drizzle`
  },
  out: 'src/core/db/migrations'
} as Config);
