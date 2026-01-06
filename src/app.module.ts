import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HealthCheckModule } from 'src/health-check/health-check.module';

import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    HealthCheckModule,
    JwtModule.register({
          global: true,
          secret: jwtConstants.secret,
          signOptions: { expiresIn: jwtConstants.expiresIn },
        }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
