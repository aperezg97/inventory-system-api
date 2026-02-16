import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CacheService } from '../utils/cache.service';

@Module({
  providers: [UsersService, CacheService],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
