import * as schema from './schema';

export type InsertUserType = typeof schema.usersTable.$inferInsert;
export type SelectUserType = typeof schema.usersTable.$inferSelect;