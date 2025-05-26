import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { eq, or, } from 'drizzle-orm';
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

  async findByUsername(username: string): Promise<User | undefined> {
    let result: [User] = (await db
      .select()
      .from(schema.usersTable)
      .where(eq(schema.usersTable.username, username))
      .limit(1)) as [any] as [User];

    const resultFirst = await dbQuerySyntax.query.usersTable.findFirst({
      where: eq(schema.usersTable.username, username),
      with: {
        createdBy: true,
      },
    });

    console.log({ result, resultFirst });

    return result && result.length ? result[0] : undefined;
  }

  async findAll(): Promise<User[]> {
    const result = await dbQuerySyntax.query.usersTable.findMany() as unknown as User[];
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
        or(eq(schema.usersTable.email, user.email), eq(schema.usersTable.username, user.username)),
      ))[0];
    if (userExists.count > 0) {
      throw new Error('User with that email or username already exists!');
    }

    user.created_at = new Date();
    user.updated_at = new Date();

    const userData = user as any as InsertUserType;
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

  async update(user: User): Promise<User | undefined> {
    const existingUser = await dbQuerySyntax.query.usersTable.findFirst({ where: eq(schema.usersTable.id, user.id), }) as User;
    if (!existingUser) {
      throw new Error('User does not exist!');
    }

    const toUpdate = {
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      updated_at: new Date(),
    };

    if (!user.password || !user.password.length) {
      delete toUpdate.password;
    }

    let result = db.update(schema.usersTable)
      .set(toUpdate)
      .where(eq(schema.usersTable.id, user.id))
      .returning() as any as User;

    return result;
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
