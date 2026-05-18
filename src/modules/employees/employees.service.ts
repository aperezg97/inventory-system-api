import { BadRequestException, Injectable } from '@nestjs/common';
import { and, asc, eq, } from 'drizzle-orm';
import { InsertUserType } from 'src/core/db/schema.types';
import { Employee, RoleModel, User } from 'src/core/models';
import { count, gt } from 'drizzle-orm';
import { ToggleStatusModel } from 'src/core/dtos';
import { BaseService } from '../base/base.service';

@Injectable()
export class EmployeesService extends BaseService {

  private employeesTable = this.dbSchema.employeesTable;

  async findOne(id: string, companyId: string): Promise<Employee | undefined> {
    let result = await this.findOneByIdAndCompany<Employee>(this.employeesTable, this.employeesTable.id, id, this.employeesTable.companyId, companyId);
    return result;
  }

  async findByEmail(email: string, companyId: string): Promise<Employee | undefined> {
    const result = await this.findOneByIdAndCompany<Employee>(this.employeesTable,  this.employeesTable.email, email, this.employeesTable.companyId, companyId);
    return result;
  }

  async findByUsername(username: string): Promise<Employee | undefined> {
    const userResult = await this.findOneById<User>(this.dbSchema.usersTable, this.dbSchema.usersTable.username, username);
    if (!userResult) {
      return undefined;
    }
    delete userResult.password;
    const user = userResult;
    if (user.roleId) {
      const roleResult = await this.findOneById<RoleModel>(this.dbSchema.rolesTable, this.dbSchema.rolesTable.id, user.roleId);
      if (roleResult) {
        user.role = roleResult;
      }
    }
    const employeeResult = await this.findOneById<Employee>(this.dbSchema.employeesTable, this.dbSchema.employeesTable.userId, user.id);
    if (!employeeResult) {
      return undefined;
    }
    const employee = employeeResult;
    employee.user = user;
    return employee;
  }

  async findAll(): Promise<Employee[]> {
    const result = (await this.dbContext
      .select()
      .from(this.employeesTable)
      .orderBy(asc(this.employeesTable.firstName), asc(this.employeesTable.lastName))
    ) as any[] as Employee[];
    return result;
  }

  async findByID(id: string): Promise<Employee> {
    const result = await this.dbContextQuerySyntax.query.employeesTable.findFirst({ where: eq(this.employeesTable.id, id), }) as any as Employee;
    return result;
  }

  async findByUserID(userId: string): Promise<Employee> {
    const result = await this.dbContextQuerySyntax.query.employeesTable.findFirst({ where: eq(this.employeesTable.userId, userId), }) as any as Employee;
    return result;
  }

  async insert(data: Employee): Promise<Employee | undefined> {
    const employeeExists = (await this.dbContext
      .select({ count: count() })
      .from(this.employeesTable)
      .where(and(
        eq(this.employeesTable.email, data.email.toLowerCase()),
        eq(this.employeesTable.companyId, data.companyId),
    )))[0];
    if (employeeExists.count > 0) {
      throw new BadRequestException('Employee with that email or username already exists!');
    }
    const userExists = (await this.dbContext
      .select({ count: count() })
      .from(this.dbSchema.usersTable)
      .where(and(eq(this.dbSchema.usersTable.email, data.email.toLowerCase()), eq(this.dbSchema.usersTable.companyId, data.companyId)),
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

    let result = this.dbContext.insert(this.dbSchema.usersTable)
      .values(employeeData)
      .returning() as any as Employee;
    // .returning({ id: this.dbSchema.usersTable.id });

    // const resultFirst = await (await this.dbContextQuerySyntax.insert(this.dbSchema.usersTable).values(userData)).rowCount;

    return result;

    // return this.users.find((user) => user.username === username);
  }

  async update(data: Employee): Promise<boolean | undefined> {
    const existingUser = await this.dbContextQuerySyntax.query.employeesTable.findFirst({ where: eq(this.employeesTable.id, data.id) }) as Employee;
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

    await this.dbContext.update(this.employeesTable)
      .set(toUpdate)
      .where(eq(this.employeesTable.id, data.id));

    return true;
  }

  async toggleActiveStatus(employeeId: string, data: ToggleStatusModel): Promise<boolean | undefined> {
    const existing = await this.dbContextQuerySyntax.query.employeesTable.findFirst({ where: eq(this.employeesTable.id, employeeId), }) as Employee;
    if (!existing) {
      throw new BadRequestException('Employee does not exist!');
    }

    const toUpdate = {
      isActive: data.isActive,
      updatedAt: new Date(),
    };

    await this.dbContext.update(this.employeesTable)
      .set(toUpdate)
      .where(eq(this.employeesTable.id, employeeId));

    return true;
  }
}
