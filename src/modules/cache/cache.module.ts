import { Module } from '@nestjs/common';
import { CacheController } from './cache.controller';
import { UtilsModule } from '../utils/utils.module';
import { UsersModule } from '../users/users.module';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [UsersModule, EmployeesModule,UtilsModule],
  controllers: [CacheController],
  providers: [],
})
export class CacheModule {}
