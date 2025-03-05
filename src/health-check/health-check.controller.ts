import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('healthcheck')
@Controller('healthcheck')
export class HealthCheckController {

  @Get()
  get(): any {
    return {
      status: 'ok',
      utc: new Date().toISOString(),
      local: new Date().toLocaleString(),
    };
  }
}
