import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [EmployeesService],
  exports: [EmployeesService],
  controllers: [EmployeesController]
})
export class EmployeesModule {}
