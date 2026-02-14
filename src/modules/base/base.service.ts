import { and, eq } from 'drizzle-orm';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { dbQuerySyntax } from 'src/core/db/connections/drizzle-query-syntax.connections';
import { db } from 'src/core/db/connections/drizzle.connections';
import * as schema from 'src/core/db/schema';

export class BaseService {
    protected dbContext = db;
    protected dbContextQuerySyntax = dbQuerySyntax;
    protected dbSchema = schema;

    protected async findOneById<T>(id: string, idColumn: any, table: PgTableWithColumns<any>): Promise<T | undefined> {
        let result: T[] = (await this.dbContext
            .select()
            .from(table)
            .where(eq(idColumn, id))
            .limit(1)) as any[] as T[];

        return result?.length ? result[0] : undefined;
    }

    protected async findOneByIdAndCompany<T>(id: string, companyId: string, idColumn: any, companyIdColumn: any, table: PgTableWithColumns<any>): Promise<T | undefined> {
        let result: T[] = (await this.dbContext
            .select()
            .from(table)
            .where(and(
                eq(idColumn, id),
                eq(companyIdColumn, companyId)
            ))
            .limit(1)) as any[] as T[];
        return result?.length ? result[0] : undefined;
    }
}