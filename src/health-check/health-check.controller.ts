import { Controller, Get } from '@nestjs/common';

@Controller('healthcheck')
export class HealthCheckController {
  @Get()
  get(): any {
    return {
      status: 'ok',
      datetime: new Date(),
    };
  }
}
