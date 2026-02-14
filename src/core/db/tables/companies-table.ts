import { pgTable, varchar, timestamp, AnyPgColumn, uuid, boolean, uniqueIndex } from "drizzle-orm/pg-core";
import { usersTable } from ".";
import { branchOfficesTable } from "./branch-offices-table";

export const companiesTable = pgTable("companies", {
  id: uuid("id").defaultRandom().primaryKey().unique(),
  name: varchar("name", { length: 250 }).notNull(),
  address: varchar("address", { length: 400 }).notNull(),
  rucNumber: varchar("ruc_number", { length: 100 }),
  dgiLicenseNumber: varchar("dgi_license_number", { length: 250 }),
  phoneNumber: varchar("phone_number", { length: 15 }),
  logoUrl: varchar("logo_url", { length: 250 }),

  mainBranchOfficeId: uuid("main_branch_office_id").references((): AnyPgColumn => branchOfficesTable.id),

  isActive: boolean("is_active").default(false),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdBy: uuid("created_by").references((): AnyPgColumn => usersTable.id),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  updatedBy: uuid("updated_by").references((): AnyPgColumn => usersTable.id),
}, (table) => []);