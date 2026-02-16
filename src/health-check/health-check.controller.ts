import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DatabaseService } from 'src/modules/database/database.service';

@ApiTags('healthcheck')
@Controller('api/v1/healthcheck')
export class HealthCheckController {

  constructor(private readonly databaseService: DatabaseService) {
  }

  @Get()
  get(): any {
    return {
      status: 'ok',
      utc: new Date().toISOString(),
      local: new Date().toLocaleString(),
    };
  }

  @Get('database')
  async checkDB(): Promise<any> {
    try {
      await this.databaseService.checkDatabaseHealth();
      return {
        status: 'ok',
        exception: null,
        datetime: new Date().toISOString(),
      };
    } catch(ex) {
      return {
        status: 'error',
        exception: ex,
        datetime: new Date().toISOString(),
      };
    }
  }
}
