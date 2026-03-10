import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { asc, eq } from 'drizzle-orm';
import { BaseModel, BranchOfficeModel } from 'src/core/models';
import { ToggleStatusModel } from 'src/core/dtos';

@Injectable()
export class BranchOfficesService extends BaseService {
    async findAllByCompany(companyId: string) {
        const result = (await this.dbContext
            .select()
            .from(this.dbSchema.branchOfficesTable)
            .where(eq(this.dbSchema.branchOfficesTable.companyId, companyId))
            .orderBy(asc(this.dbSchema.branchOfficesTable.name))
        ) as BranchOfficeModel[];
        return result;
    }

    async findOne(id: string, companyId: string): Promise<BranchOfficeModel | undefined> {
        let result = await this.findOneByIdAndCompany<BranchOfficeModel>(this.dbSchema.branchOfficesTable,
            this.dbSchema.branchOfficesTable.id, id,
            this.dbSchema.branchOfficesTable.companyId, companyId
        );
        return result;
    }

    async create(createItemDto: BranchOfficeModel) {
        const result = await this.insertOne<BranchOfficeModel>(this.dbSchema.branchOfficesTable, createItemDto);
        return result;
    }

    async update(updateItemDto: BranchOfficeModel) {
        const currentItem = await this.findOneById<BranchOfficeModel>(this.dbSchema.branchOfficesTable, this.dbSchema.branchOfficesTable.id, updateItemDto.id);
        if (!currentItem) {
          return null;
        }
        currentItem.name = updateItemDto.name;
        currentItem.address = updateItemDto.address;
        currentItem.phoneNumber = updateItemDto.phoneNumber;
        currentItem.logoUrl = updateItemDto.logoUrl;
        currentItem.notes = updateItemDto.notes;
        const result = await this.updateOne(this.dbSchema.branchOfficesTable, currentItem, this.dbSchema.branchOfficesTable.id, currentItem.id);
        return result;
      }

      async toggleActiveStatus(id: string, companyId: string, data: ToggleStatusModel): Promise<boolean | undefined> {
        const existingUser = await this.findOneByIdAndCompany<BranchOfficeModel>(this.dbSchema.branchOfficesTable,
            this.dbSchema.branchOfficesTable.id, id,
            this.dbSchema.branchOfficesTable.companyId, companyId
        );
        if (!existingUser) {
          throw new BadRequestException('Item does not exist!');
        }
        const toUpdate = {
          isActive: data.isActive,
          updatedAt: new Date(),
        } as BaseModel;
        await this.updateOneNonReturning(this.dbSchema.branchOfficesTable, toUpdate, this.dbSchema.branchOfficesTable.id, existingUser.id);
        return true;
      }
}
