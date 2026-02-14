import { Injectable } from "@nestjs/common";
import { BaseService } from "../base/base.service";

@Injectable()
export class DatabaseService extends BaseService {
    async checkDatabaseHealth(): Promise<boolean> {
        await this.dbContext.$client.connect();
        return true;
    }
}