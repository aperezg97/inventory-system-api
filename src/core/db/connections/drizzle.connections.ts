import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from 'pg';

require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DB_URL,
  });

  const db = drizzle(pool);

  export { pool, db };
  // export default config;

  /*
  CLIENT CONNECTION
  import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
  import { drizzle } from "drizzle-orm/node-postgres";
  import { Client } from "pg";

  const client = new Client({
    connectionString: "postgres://user:password@host:port/db",
  });

  // or
  const client = new Client({
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "password",
    database: "db_name",
  });

  await client.connect();
  const db = drizzle(client);
  */

  /*
  POOL CONNECTION
  import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
  import { drizzle } from "drizzle-orm/node-postgres";
  import { Pool } from "pg";

  const pool = new Pool({
    connectionString: "postgres://user:password@host:port/db",
  });

  // or
  const pool = new Pool({
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "password",
    database: "db_name",
  });

  const db = drizzle(pool);
  */