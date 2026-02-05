import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';

@Module({
  providers: [EmployeesService],
  exports: [EmployeesService],
  controllers: []
})
export class EmployeesModule {}
