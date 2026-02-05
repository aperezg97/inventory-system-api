import { BadRequestException, Injectable } from '@nestjs/common';
import { and, asc, eq, or, } from 'drizzle-orm';
import { db } from 'src/core/db/connections/drizzle.connections';
import { dbQuerySyntax } from 'src/core/db/connections/drizzle-query-syntax.connections';
import * as schema from 'src/core/db/schema';
import { InsertUserType } from 'src/core/db/schema.types';
import { Employee, Role, User } from 'src/core/models';
import { count, gt } from 'drizzle-orm';
import { ToggleStatusModel } from 'src/core/dtos';

@Injectable()
export class EmployeesService {

  async findOne(id: string): Promise<Employee | undefined> {
    let result: Employee[] = (await db
      .select()
      .from(schema.employeesTable)
      .where(eq(schema.employeesTable.id, id))
      .limit(1)) as any[] as Employee[];

      return result?.length ? result[0] : undefined;
  }

  async findByEmail(email: string): Promise<Employee | undefined> {
    let result: Employee[] = (await db
      .select()
      .from(schema.employeesTable)
      .where(eq(schema.employeesTable.email, email))
      .limit(1)) as any[] as Employee[];

      return result?.length ? result[0] : undefined;
  }

  async findByUsername(username: string): Promise<Employee | undefined> {
    let userResult: User[] = (await db
      .select({
        id: schema.usersTable.id,
        username: schema.usersTable.username,
        password: schema.usersTable.password,
        isActive: schema.usersTable.isActive,
        created_at: schema.usersTable.createdAt,
        created_by: schema.usersTable.createdBy,
        updated_at: schema.usersTable.updatedAt,
        updated_by: schema.usersTable.updatedBy,
      })
      .from(schema.usersTable)
      .where(
        or(eq(schema.usersTable.username, username.toLowerCase()), eq(schema.usersTable.username, username.toLowerCase()))
      )
      // .where(eq(schema.usersTable.username, username))
      .limit(1)) as any[] as User[];

    console.log({userResult});

    if (!userResult?.length) {
      return undefined;
    }
    const user = userResult[0];
    if (user.roleId) {
      const roleResult: Role[] = (await db
        .select()
        .from(schema.rolesTable)
        .where(eq(schema.rolesTable.id, user.roleId))
        .limit(1)) as any[] as Role[];

      if (roleResult?.length) {
        user.role = roleResult[0];
      }
    }

    let employeeResult: Employee[] = (await db
      .select()
      .from(schema.employeesTable)
      .where(eq(schema.employeesTable.userId, user.id))
      .limit(1)) as any[] as Employee[];

    if (!employeeResult?.length) {
      return undefined;
    }

    const employee = employeeResult[0];
    employee.user = user;

    return employee;
  }

  async findAll(): Promise<Employee[]> {
    const result = (await db
      .select()
      .from(schema.employeesTable)
      .orderBy(asc(schema.employeesTable.firstName), asc(schema.employeesTable.lastName))
    ) as any[] as Employee[];
    return result;
  }

  async findByID(id: string): Promise<Employee> {
    const result = await dbQuerySyntax.query.employeesTable.findFirst({ where: eq(schema.employeesTable.id, id), }) as any as Employee;
    return result;
  }

  async insert(data: Employee): Promise<Employee | undefined> {
    const employeeExists = (await db
      .select({ count: count() })
      .from(schema.employeesTable)
      .where(and(
        eq(schema.employeesTable.email, data.email.toLowerCase()),
        eq(schema.employeesTable.companyId, data.companyId),
    )))[0];
    if (employeeExists.count > 0) {
      throw new BadRequestException('Employee with that email or username already exists!');
    }
    const userExists = (await db
      .select({ count: count() })
      .from(schema.usersTable)
      .where(and(eq(schema.usersTable.email, data.email.toLowerCase()), eq(schema.usersTable.companyId, data.companyId)),
      ))[0];
    if (userExists.count > 0) {
      throw new BadRequestException('User with that email or username already exists!');
    }

    data.createdAt = new Date();
    data.updatedAt = new Date();

    const employeeData = data as any as InsertUserType;
    employeeData.email = employeeData.email?.toLowerCase();
    employeeData.username = employeeData.username?.toLowerCase();
    employeeData.id = undefined;
    employeeData.isActive = true;

    let result = db.insert(schema.usersTable)
      .values(employeeData)
      .returning() as any as Employee;
    // .returning({ id: schema.usersTable.id });

    // const resultFirst = await (await dbQuerySyntax.insert(schema.usersTable).values(userData)).rowCount;

    return result;

    // return this.users.find((user) => user.username === username);
  }

  async update(data: Employee): Promise<boolean | undefined> {
    const existingUser = await dbQuerySyntax.query.employeesTable.findFirst({ where: eq(schema.employeesTable.id, data.id) }) as Employee;
    if (!existingUser) {
      throw new BadRequestException('User with ID: ' + data.id + ' does not exist!');
    }

    const toUpdate = {
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      email: data.email.toLowerCase(),
      profileImageUrl: data.profileImageUrl,
      branchOfficeId: data.branchOfficeId,

      updatedAt: new Date(),
    };

    await db.update(schema.employeesTable)
      .set(toUpdate)
      .where(eq(schema.employeesTable.id, data.id));

    return true;
  }

  async toggleActiveStatus(employeeId: string, data: ToggleStatusModel): Promise<boolean | undefined> {
    const existing = await dbQuerySyntax.query.employeesTable.findFirst({ where: eq(schema.employeesTable.id, employeeId), }) as Employee;
    if (!existing) {
      throw new BadRequestException('Employee does not exist!');
    }

    const toUpdate = {
      isActive: data.isActive,
      updatedAt: new Date(),
    };

    await db.update(schema.employeesTable)
      .set(toUpdate)
      .where(eq(schema.employeesTable.id, employeeId));

    return true;
  }
}
