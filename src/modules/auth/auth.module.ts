import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/modules/users/users.module';
import { EmployeesModule } from '../employees/employees.module';
import { CacheService } from '../utils/cache.service';

@Module({
  imports: [EmployeesModule, UsersModule],
  providers: [AuthService, CacheService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
