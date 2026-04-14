import { Module } from '@nestjs/common';
import { BranchOfficesController } from './branch-offices.controller';
import { BranchOfficesService } from './branch-offices.service';
import { UtilsModule } from '../utils/utils.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, UtilsModule],
  controllers: [BranchOfficesController],
  providers: [BranchOfficesService]
})
export class BranchOfficesModule { }
