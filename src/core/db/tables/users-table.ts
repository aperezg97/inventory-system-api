import { pgTable, varchar, timestamp, AnyPgColumn, uuid, boolean, uniqueIndex } from "drizzle-orm/pg-core";
// import { relations } from "drizzle-orm";
import { rolesTable } from "./roles-table";
import { companiesTable } from "./companies-table";

export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey().unique(),
  username: varchar("username", { length: 100 }).notNull(),
  password: varchar("password", { length: 256 }).notNull(),
  email: varchar("email", { length: 150 }),

  roleId: uuid("role_id").references((): AnyPgColumn => rolesTable.id),
  companyId: uuid("company_id").references((): AnyPgColumn => companiesTable.id),
  isActive: boolean("is_active").default(false),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdBy: uuid("created_by").references((): AnyPgColumn => usersTable.id),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  updatedBy: uuid("updated_by").references((): AnyPgColumn => usersTable.id),
}, (table) => [
    uniqueIndex('users_email_company').on(table.companyId, table.email),
    uniqueIndex('users_username_company').on(table.companyId, table.username),
])

// export const contractsRelations = relations(
//   usersTable,
//   ({ one, many }) => ({
//     createdBy: one(usersTable, {
//           fields: [usersTable.created_by],
//           references: [usersTable.id],
//       }),
//       updatedBy: one(usersTable, {
//         fields: [usersTable.updated_by],
//         references: [usersTable.id],
//     }),
//   })
// );
