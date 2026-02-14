import * as schema from './schema';

export type InsertUserType = typeof schema.usersTable.$inferInsert;
export type SelectUserType = typeof schema.usersTable.$inferSelect;

export type InsertRoleType = typeof schema.rolesTable.$inferInsert;
export type SelectRoleType = typeof schema.rolesTable.$inferSelect;

export type InsertEmployeeType = typeof schema.employeesTable.$inferInsert;
export type SelectEmployeeType = typeof schema.employeesTable.$inferSelect;

export type InsertCompaniesType = typeof schema.companiesTable.$inferInsert;
export type SelectCompaniesType = typeof schema.companiesTable.$inferSelect;

export type InsertBranchOfficesType = typeof schema.branchOfficesTable.$inferInsert;
export type SelectBranchOfficesType = typeof schema.branchOfficesTable.$inferSelect;