import { and, eq } from 'drizzle-orm';
import { PgInsertValue, PgTableWithColumns, PgUpdateSetSource } from 'drizzle-orm/pg-core';
import { dbQuerySyntax } from 'src/core/db/connections/drizzle-query-syntax.connections';
import { db } from 'src/core/db/connections/drizzle.connections';
import * as schema from 'src/core/db/schema';

export class BaseService {
    protected dbContext = db;
    protected dbContextQuerySyntax = dbQuerySyntax;
    protected dbSchema = schema;

    protected async findOneById<T>(table: PgTableWithColumns<any>, idColumn: any, id: string): Promise<T | undefined> {
        let result: T[] = (await this.dbContext
            .select()
            .from(table)
            .where(eq(idColumn, id))
            .limit(1)) as any[] as T[];

        return result?.length ? result[0] : undefined;
    }

    protected async findOneByIdAndCompany<T>(table: PgTableWithColumns<any>,
        idColumn: any, id: string,
        companyIdColumn: any, companyId: string): Promise<T | undefined> {
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

    protected async insertOne<T>(table: PgTableWithColumns<any>, values: PgInsertValue<any>): Promise<T | undefined> {
        let result: any = await this.dbContext
            .insert(table)
            .values(values)
            .returning();
        return result?.length ? result[0] : undefined;
    }

    protected async updateOne<T>(table: PgTableWithColumns<any>, values: PgUpdateSetSource<any>, idColumn: any, idValue: string): Promise<T | undefined> {
        let result: any = await this.dbContext
            .update(table)
            .set(values)
            .where(eq(idColumn, idValue))
            .returning();
        return result?.length ? result[0] : undefined;
    }

    protected async updateOneNonReturning<T>(table: PgTableWithColumns<any>, values: PgUpdateSetSource<any>, idColumn: any, idValue: string) {
        await this.dbContext
            .update(table)
            .set(values)
            .where(eq(idColumn, idValue))
            .returning();
    }
}