import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { UsersModule } from '../users/users.module';
import { CacheService } from '../utils/cache.service';

@Module({
  imports: [UsersModule],
  providers: [EmployeesService, CacheService],
  exports: [EmployeesService],
  controllers: [EmployeesController]
})
export class EmployeesModule {}
