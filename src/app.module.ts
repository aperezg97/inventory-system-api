import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HealthCheckModule } from 'src/health-check/health-check.module';

@Module({
  imports: [AuthModule, UsersModule, HealthCheckModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
