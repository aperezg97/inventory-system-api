import { pgTable, varchar, timestamp, AnyPgColumn, uuid, boolean, uniqueIndex } from "drizzle-orm/pg-core";
import { usersTable } from ".";
import { companiesTable } from "./companies-table";

export const branchOfficesTable = pgTable("branch-offices", {
  id: uuid("id").defaultRandom().primaryKey().unique(),
  name: varchar("name", { length: 250 }).notNull(),
  address: varchar("address", { length: 400 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 15 }),
  logoUrl: varchar("logo_url", { length: 250 }),
  notes: varchar("notes", { length: 500 }),

  companyId: uuid("company_id").notNull().references((): AnyPgColumn => companiesTable.id),

  isActive: boolean("is_active").default(false),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdBy: uuid("created_by").references((): AnyPgColumn => usersTable.id),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  updatedBy: uuid("updated_by").references((): AnyPgColumn => usersTable.id),
}, (table) => []);