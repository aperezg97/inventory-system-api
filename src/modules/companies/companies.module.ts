import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { UsersModule } from '../users/users.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [UsersModule, UtilsModule],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}
