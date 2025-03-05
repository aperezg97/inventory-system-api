import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from './connections/drizzle.connections';

// this will automatically run needed migrations on the database
console.log({
    dirname: __dirname  + "/migrations",
    DB_URL: process.env.DB_URL
});
migrate(db, {
    migrationsFolder: __dirname  + "/migrations",
    migrationsTable: '__drizzle_migrations',
    migrationsSchema: 'public',
})
  .then(() => {
    console.log("Migrations complete!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Migrations failed!", err);
    process.exit(1);
  });
