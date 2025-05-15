import { Injectable } from "@nestjs/common";
import { db } from "src/core/db/connections/drizzle.connections";

@Injectable()
export class DatabaseService {
    async checkDatabaseHealth(): Promise<boolean> {
        await db.$client.connect();
        return true;
    }
}