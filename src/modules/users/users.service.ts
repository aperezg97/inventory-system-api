import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { and, asc, eq, or, } from 'drizzle-orm';
import { InsertUserType } from 'src/core/db/schema.types';
import { count, gt } from 'drizzle-orm';
import { ToggleStatusModel } from 'src/core/dtos';
import { RoleModel, User } from 'src/core/models';
import { BaseService } from '../base/base.service';

/*
let userResult: User[] = (await this.dbContext
      .select({
        id: this.dbSchema.usersTable.id,
        firstName: this.dbSchema.usersTable.firstName,
        lastName: this.dbSchema.usersTable.lastName,
        email: this.dbSchema.usersTable.email,
        username: this.dbSchema.usersTable.username,
        password: this.dbSchema.usersTable.password,
        isActive: this.dbSchema.usersTable.isActive,
        created_at: this.dbSchema.usersTable.created_at,
        created_by: this.dbSchema.usersTable.created_by,
        updated_at: this.dbSchema.usersTable.updated_at,
        updated_by: this.dbSchema.usersTable.updated_by,
      })
      .from(this.dbSchema.usersTable)
      .where(
        or(eq(this.dbSchema.usersTable.email, username.toLowerCase()), eq(this.dbSchema.usersTable.username, username.toLowerCase()))
      )
      // .where(eq(this.dbSchema.usersTable.username, username))
      .limit(1)) as any[] as User[];

    console.log({userResult});

    const resultFirst = await this.dbContextQuerySyntax.query.usersTable.findFirst({
      columns: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        isActive: true,
        created_at: true,
        created_by: true,
        updated_at: true,
        updated_by: true,
        password: false,
      },
      where: or(eq(this.dbSchema.usersTable.email, username.toLowerCase()), eq(this.dbSchema.usersTable.username, username.toLowerCase())),
      with: {
        createdBy: true,
      },
    });
*/

@Injectable()
export class UsersService extends BaseService {

  async findOne(username: string): Promise<User | undefined> {
    let result = await this.findOneById<User>(username, this.dbSchema.usersTable.username, this.dbSchema.usersTable);
    return result;
  }

  async findByUsername(username: string, companyId: string): Promise<User | undefined> {
    let userResult = await this.findOneByIdAndCompany<User>(username, companyId, this.dbSchema.usersTable.username, this.dbSchema.usersTable.companyId, this.dbSchema.usersTable);
    if (!userResult) {
      return undefined;
    }
    const user = userResult;
    if (user.roleId) {
      const roleResult = await this.findOneByIdAndCompany<RoleModel>(username, companyId, this.dbSchema.rolesTable.id, this.dbSchema.rolesTable.companyId, this.dbSchema.rolesTable);
      if (roleResult) {
        user.role = roleResult;
      }
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    const result = (await this.dbContext
      .select({
        id: this.dbSchema.usersTable.id,
        email: this.dbSchema.usersTable.email,
        username: this.dbSchema.usersTable.username,
        isActive: this.dbSchema.usersTable.isActive,
        createdAt: this.dbSchema.usersTable.createdAt,
        createdBy: this.dbSchema.usersTable.createdBy,
        updatedAt: this.dbSchema.usersTable.updatedAt,
        updatedBy: this.dbSchema.usersTable.updatedBy,
       })
      .from(this.dbSchema.usersTable)
      .orderBy(asc(this.dbSchema.usersTable.username))
    ) as User[];
    return result.map(x => ({ ...x, password: undefined }));
  }

  async findByID(id: string): Promise<User> {
    const result = await this.dbContextQuerySyntax.query.usersTable.findFirst({ where: eq(this.dbSchema.usersTable.id, id), }) as User;
    return result;
  }

  async insert(user: User): Promise<User | undefined> {
    let whereCondition = user.email ?
      or(
        and(
          eq(this.dbSchema.usersTable.email, user.email!.toLowerCase()),
          eq(this.dbSchema.usersTable.companyId, user.companyId),
        ),
        and(
          eq(this.dbSchema.usersTable.username, user.username.toLowerCase()),
          eq(this.dbSchema.usersTable.companyId, user.companyId),
        ),
      ) :
      and(
          eq(this.dbSchema.usersTable.username, user.username.toLowerCase()),
          eq(this.dbSchema.usersTable.companyId, user.companyId),
      );
    const userExists = (await this.dbContext
      .select({ count: count() })
      .from(this.dbSchema.usersTable)
      .where(whereCondition))[0];
    if (userExists.count > 0) {
      throw new BadRequestException('User with that email or username already exists!');
    }

    user.createdAt = new Date();
    user.updatedAt = new Date();

    const userData = user as any as InsertUserType;
    userData.email = userData.email?.toLowerCase();
    userData.username = userData.username?.toLowerCase();
    userData.id = undefined;
    userData.isActive = true;

    let result = this.dbContext.insert(this.dbSchema.usersTable)
      .values(userData)
      .returning() as any as User;
    // .returning({ id: this.dbSchema.usersTable.id });

    // const resultFirst = await (await this.dbContextQuerySyntax.insert(this.dbSchema.usersTable).values(userData)).rowCount;

    return result;

    // return this.users.find((user) => user.username === username);
  }

  async update(user: User): Promise<boolean | undefined> {
    if (!user.username) {
      throw new BadRequestException('Username is required!');
    }
    const existingUser = await this.dbContextQuerySyntax.query.usersTable.findFirst({ where: eq(this.dbSchema.usersTable.id, user.id), }) as User;
    if (!existingUser) {
      throw new BadRequestException('User with ID: ' + user.id + ' does not exist!');
    }

    const toUpdate = {
      email: user.email?.toLowerCase(),
      password: user.password,
      updatedAt: new Date(),
    };

    if (!user.password || !user.password.length) {
      delete toUpdate.password;
    }

    await this.dbContext.update(this.dbSchema.usersTable)
      .set(toUpdate)
      .where(eq(this.dbSchema.usersTable.id, user.id));

    return true;
  }

  async toggleActiveStatus(userId: string, data: ToggleStatusModel): Promise<boolean | undefined> {
    const existingUser = await this.dbContextQuerySyntax.query.usersTable.findFirst({ where: eq(this.dbSchema.usersTable.id, userId), }) as User;
    if (!existingUser) {
      throw new BadRequestException('User does not exist!');
    }

    const toUpdate = {
      isActive: data.isActive,
      updated_at: new Date(),
    };

    await this.dbContext.update(this.dbSchema.usersTable)
      .set(toUpdate)
      .where(eq(this.dbSchema.usersTable.id, userId));

    return true;
  }
}
