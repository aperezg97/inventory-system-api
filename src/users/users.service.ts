import { Injectable } from '@nestjs/common';
import { eq, } from 'drizzle-orm';
import { db }  from 'src/core/db/connections/drizzle.connections';
import { dbQuerySyntax }  from 'src/core/db/connections/drizzle-query-syntax.connections';
import * as schema from 'src/core/db/schema';
import { InsertUserType } from 'src/core/db/schema.types';
import { User } from 'src/core/models';
import { uuid } from 'drizzle-orm/pg-core';

@Injectable()
export class UsersService {

  async findOne(username: string): Promise<User | undefined> {
    let result: [User] = (await db
      .select()
      .from(schema.usersTable)
      .where(eq(schema.usersTable.username, username))
      .limit(1)) as [any] as [User];

    console.log({result});

    const resultFirst = await dbQuerySyntax.query.usersTable.findFirst({
      where: eq(schema.usersTable.username, username),
      with: {
        createdBy: true,
      },
    });

    console.log({ result, resultFirst });

    return result && result.length ? result[0] : undefined;
  }

  async insert(user: User): Promise<User | undefined> {
    user.created_at = new Date();
    user.updated_at = new Date();

    const userData = user as any as InsertUserType;
    userData.id = undefined;

    let result = db.insert(schema.usersTable)
    .values(userData)
    .returning() as any as User;
    // .returning({ id: schema.usersTable.id });

    console.log({result});

    const resultFirst = await (await dbQuerySyntax.insert(schema.usersTable).values(userData)).rowCount;

    console.log({ result, resultFirst });

    return result;

    // return this.users.find((user) => user.username === username);
  }
}
