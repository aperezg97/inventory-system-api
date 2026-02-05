import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { and, asc, eq, or, } from 'drizzle-orm';
import { db } from 'src/core/db/connections/drizzle.connections';
import { dbQuerySyntax } from 'src/core/db/connections/drizzle-query-syntax.connections';
import * as schema from 'src/core/db/schema';
import { InsertUserType } from 'src/core/db/schema.types';
import { count, gt } from 'drizzle-orm';
import { ToggleStatusModel } from 'src/core/dtos';
import { Role, User } from 'src/core/models';

/*
let userResult: User[] = (await db
      .select({
        id: schema.usersTable.id,
        firstName: schema.usersTable.firstName,
        lastName: schema.usersTable.lastName,
        email: schema.usersTable.email,
        username: schema.usersTable.username,
        password: schema.usersTable.password,
        isActive: schema.usersTable.isActive,
        created_at: schema.usersTable.created_at,
        created_by: schema.usersTable.created_by,
        updated_at: schema.usersTable.updated_at,
        updated_by: schema.usersTable.updated_by,
      })
      .from(schema.usersTable)
      .where(
        or(eq(schema.usersTable.email, username.toLowerCase()), eq(schema.usersTable.username, username.toLowerCase()))
      )
      // .where(eq(schema.usersTable.username, username))
      .limit(1)) as any[] as User[];

    console.log({userResult});

    const resultFirst = await dbQuerySyntax.query.usersTable.findFirst({
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
      where: or(eq(schema.usersTable.email, username.toLowerCase()), eq(schema.usersTable.username, username.toLowerCase())),
      with: {
        createdBy: true,
      },
    });
*/

@Injectable()
export class UsersService {

  async findOne(username: string): Promise<User | undefined> {
    let result: [User] = (await db
      .select()
      .from(schema.usersTable)
      .where(eq(schema.usersTable.username, username))
      .limit(1)) as [any] as [User];
      console.log({result});
      return result?.length ? result[0] : undefined;
  }

  async findByUsername(username: string): Promise<User | undefined> {
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

    return user;
  }

  async findAll(): Promise<User[]> {
    const result = (await db
      .select({
        id: schema.usersTable.id,
        email: schema.usersTable.email,
        username: schema.usersTable.username,
        isActive: schema.usersTable.isActive,
        createdAt: schema.usersTable.createdAt,
        createdBy: schema.usersTable.createdBy,
        updatedAt: schema.usersTable.updatedAt,
        updatedBy: schema.usersTable.updatedBy,
       })
      .from(schema.usersTable)
      .orderBy(asc(schema.usersTable.username))
    ) as User[];
    return result.map(x => ({ ...x, password: undefined }));
  }

  async findByID(id: string): Promise<User> {
    const result = await dbQuerySyntax.query.usersTable.findFirst({ where: eq(schema.usersTable.id, id), }) as User;
    return result;
  }

  async insert(user: User): Promise<User | undefined> {
    let whereCondition = user.email ?
      or(
        and(
          eq(schema.usersTable.email, user.email!.toLowerCase()),
          eq(schema.usersTable.companyId, user.companyId),
        ),
        and(
          eq(schema.usersTable.username, user.username.toLowerCase()),
          eq(schema.usersTable.companyId, user.companyId),
        ),
      ) :
      and(
          eq(schema.usersTable.username, user.username.toLowerCase()),
          eq(schema.usersTable.companyId, user.companyId),
      );
    const userExists = (await db
      .select({ count: count() })
      .from(schema.usersTable)
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

    let result = db.insert(schema.usersTable)
      .values(userData)
      .returning() as any as User;
    // .returning({ id: schema.usersTable.id });

    // const resultFirst = await (await dbQuerySyntax.insert(schema.usersTable).values(userData)).rowCount;

    return result;

    // return this.users.find((user) => user.username === username);
  }

  async update(user: User): Promise<boolean | undefined> {
    if (!user.username) {
      throw new BadRequestException('Username is required!');
    }
    const existingUser = await dbQuerySyntax.query.usersTable.findFirst({ where: eq(schema.usersTable.id, user.id), }) as User;
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

    await db.update(schema.usersTable)
      .set(toUpdate)
      .where(eq(schema.usersTable.id, user.id));

    return true;
  }

  async toggleActiveStatus(userId: string, data: ToggleStatusModel): Promise<boolean | undefined> {
    const existingUser = await dbQuerySyntax.query.usersTable.findFirst({ where: eq(schema.usersTable.id, userId), }) as User;
    if (!existingUser) {
      throw new BadRequestException('User does not exist!');
    }

    const toUpdate = {
      isActive: data.isActive,
      updated_at: new Date(),
    };

    await db.update(schema.usersTable)
      .set(toUpdate)
      .where(eq(schema.usersTable.id, userId));

    return true;
  }
}
