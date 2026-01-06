import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { asc, eq, or, } from 'drizzle-orm';
import { db } from 'src/core/db/connections/drizzle.connections';
import { dbQuerySyntax } from 'src/core/db/connections/drizzle-query-syntax.connections';
import * as schema from 'src/core/db/schema';
import { InsertUserType } from 'src/core/db/schema.types';
import { User } from 'src/core/models';
import { uuid } from 'drizzle-orm/pg-core';
import { count, gt } from 'drizzle-orm';
import { ToggleStatusModel } from 'src/core/dtos';

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
    let result: [User] = (await db
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
      .where(eq(schema.usersTable.username, username))
      .limit(1)) as [any] as [User];

    console.log({result});

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
      where: eq(schema.usersTable.username, username),
      with: {
        createdBy: true,
      },
    });

    console.log({ result, resultFirst });

    return result?.length ? result[0] : undefined;
  }

  async findAll(): Promise<User[]> {
    const result = (await db
      .select({
        id: schema.usersTable.id,
        firstName: schema.usersTable.firstName,
        lastName: schema.usersTable.lastName,
        email: schema.usersTable.email,
        username: schema.usersTable.username,
        isActive: schema.usersTable.isActive,
        created_at: schema.usersTable.created_at,
        created_by: schema.usersTable.created_by,
        updated_at: schema.usersTable.updated_at,
        updated_by: schema.usersTable.updated_by,
       })
      .from(schema.usersTable)
      .orderBy(asc(schema.usersTable.firstName), asc(schema.usersTable.lastName))
    ) as User[];
    return result.map(x => ({ ...x, password: undefined }));
  }

  async findByID(id: string): Promise<User> {
    const result = await dbQuerySyntax.query.usersTable.findFirst({ where: eq(schema.usersTable.id, id), }) as User;
    return result;
  }

  async insert(user: User): Promise<User | undefined> {
    const userExists = (await db
      .select({ count: count() })
      .from(schema.usersTable)
      .where(
        or(eq(schema.usersTable.email, user.email.toLowerCase()), eq(schema.usersTable.username, user.username.toLowerCase())),
      ))[0];
    if (userExists.count > 0) {
      throw new BadRequestException('User with that email or username already exists!');
    }

    user.created_at = new Date();
    user.updated_at = new Date();

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
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email.toLowerCase(),
      password: user.password,
      updated_at: new Date(),
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
