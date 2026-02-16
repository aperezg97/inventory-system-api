import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/modules/users/users.module';
import { EmployeesModule } from '../employees/employees.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [EmployeesModule, UsersModule, UtilsModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
