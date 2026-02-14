import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HealthCheckModule } from 'src/health-check/health-check.module';

import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './modules/auth/constants';
import { EmployeesModule } from './modules/employees/employees.module';
import { CompaniesModule } from './modules/companies/companies.module';

@Module({
  imports: [
    AuthModule,
    EmployeesModule,
    UsersModule,
    HealthCheckModule,
    JwtModule.register({
          global: true,
          secret: jwtConstants.secret,
          signOptions: { expiresIn: jwtConstants.expiresIn },
        }),
    CompaniesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
