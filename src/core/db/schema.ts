import { pgTable, varchar, timestamp, AnyPgColumn, uuid, boolean, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// enable Postgres extension for UUID generation
// CREATE EXTENSION IF NOT EXISTS pgcrypto

export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey().unique(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }),
  email: varchar("email", { length: 150 }).notNull(),
  username: varchar("username", { length: 100 }).notNull(),
  password: varchar("password", { length: 256 }).notNull(),
  isActive: boolean("is_active").default(false),
  created_at: timestamp("created_at").notNull().defaultNow(),
  created_by: uuid("created_by").references((): AnyPgColumn => usersTable.id),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
  updated_by: uuid("updated_by").references((): AnyPgColumn => usersTable.id),
}, (table) => ({
  // l2: index('l2_index').using('hnsw', table.id.op('vector_l2_ops'))
}))

export const contractsRelations = relations(
  usersTable,
  ({ one, many }) => ({
    createdBy: one(usersTable, {
          fields: [usersTable.created_by],
          references: [usersTable.id],
      }),
      updatedBy: one(usersTable, {
        fields: [usersTable.updated_by],
        references: [usersTable.id],
    }),
  })
);
