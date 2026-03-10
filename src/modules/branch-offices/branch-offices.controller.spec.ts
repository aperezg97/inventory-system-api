import { Test, TestingModule } from '@nestjs/testing';
import { BranchOfficesController } from './branch-offices.controller';

describe('BranchOfficesController', () => {
  let controller: BranchOfficesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BranchOfficesController],
    }).compile();

    controller = module.get<BranchOfficesController>(BranchOfficesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
