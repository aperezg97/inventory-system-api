import { pgTable, varchar, timestamp, AnyPgColumn, uuid, boolean, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { usersTable } from "./users-table";

export const rolesTable = pgTable("roles", {
  id: uuid("id").defaultRandom().primaryKey().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description", { length: 500 }),

  isActive: boolean("is_active").default(false),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdBy: uuid("created_by").references((): AnyPgColumn => usersTable.id),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  updatedBy: uuid("updated_by").references((): AnyPgColumn => usersTable.id),
}, (table) => [
    // index('custom_name').on(table.id),
])
