import * as tables from "./tables";

// enable Postgres extension for UUID generation
// CREATE EXTENSION IF NOT EXISTS pgcrypto

export const rolesTable = tables.rolesTable;
export const usersTable = tables.usersTable;
export const employeesTable = tables.employeesTable;
