import { Module } from '@nestjs/common';
import { BranchOfficesController } from './branch-offices.controller';
import { BranchOfficesService } from './branch-offices.service';

@Module({
  controllers: [BranchOfficesController],
  providers: [BranchOfficesService]
})
export class BranchOfficesModule { }
