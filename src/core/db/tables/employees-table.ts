import { pgTable, varchar, timestamp, AnyPgColumn, uuid, boolean, uniqueIndex } from "drizzle-orm/pg-core";
import { usersTable } from ".";

export const employeesTable = pgTable("employees", {
  id: uuid("id").defaultRandom().primaryKey().unique(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 150 }),
  address: varchar("address", { length: 250 }),
  phoneNumber: varchar("phone_number", { length: 15 }),
  profileImageUrl: varchar("profile_image_url", { length: 250 }),

  branchOfficeId: uuid("branch_office_id"),
  companyId: uuid("company_id"),
  userId: uuid("user_id").references((): AnyPgColumn => usersTable.id),

  isActive: boolean("is_active").default(false),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdBy: uuid("created_by").references((): AnyPgColumn => usersTable.id),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  updatedBy: uuid("updated_by").references((): AnyPgColumn => usersTable.id),
}, (table) => [
  uniqueIndex('employees_email_company').on(table.companyId, table.email),
])
