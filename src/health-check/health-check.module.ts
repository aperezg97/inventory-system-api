import { Module } from '@nestjs/common';
import { HealthCheckController } from 'src/health-check/health-check.controller';
import { DatabaseService } from 'src/modules/database/database.service';

@Module({
  providers: [DatabaseService],
  controllers: [HealthCheckController],
})
export class HealthCheckModule {}