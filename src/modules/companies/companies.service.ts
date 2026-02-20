import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseModel, CompanyModel } from 'src/core/models';
import { BaseService } from '../base/base.service';
import { asc } from 'drizzle-orm';
import { ToggleStatusModel } from 'src/core/dtos';

@Injectable()
export class CompaniesService extends BaseService {
  async findAll() {
    const result = (await this.dbContext
      .select()
      .from(this.dbSchema.companiesTable)
      .orderBy(asc(this.dbSchema.companiesTable.name))
    ) as CompanyModel[];
    return result;
  }

  async findOne(id: string): Promise<CompanyModel | undefined> {
    let result = await this.findOneById<CompanyModel>(this.dbSchema.companiesTable, this.dbSchema.companiesTable.id, id);
    return result;
  }

  async create(createCompanyDto: CompanyModel) {
    createCompanyDto.createdAt = new Date();
    createCompanyDto.updatedAt = new Date();
    const result = await this.insertOne<CompanyModel>(this.dbSchema.companiesTable, createCompanyDto);
    return result;
  }

  async update(updateCompanyDto: CompanyModel) {
    const currentItem = await this.findOneById<CompanyModel>(this.dbSchema.companiesTable, this.dbSchema.companiesTable.id, updateCompanyDto.id);
    if (!currentItem) {
      return null;
    }
    currentItem.name = updateCompanyDto.name;
    currentItem.address = updateCompanyDto.address;
    currentItem.rucNumber = updateCompanyDto.rucNumber;
    currentItem.dgiLicenseNumber = updateCompanyDto.dgiLicenseNumber;
    currentItem.phoneNumber = updateCompanyDto.phoneNumber;
    currentItem.logoUrl = updateCompanyDto.logoUrl;
    currentItem.mainBranchOfficeId = updateCompanyDto.mainBranchOfficeId;
    currentItem.updatedAt = new Date();
    const result = await this.updateOne(this.dbSchema.companiesTable, currentItem, this.dbSchema.companiesTable.id, currentItem.id);
    return result;
  }

  async toggleActiveStatus(id: string, data: ToggleStatusModel): Promise<boolean | undefined> {
    const existingUser = await this.findOneById<CompanyModel>(this.dbSchema.companiesTable, this.dbSchema.companiesTable.id, id);
    if (!existingUser) {
      throw new BadRequestException('Item does not exist!');
    }
    const toUpdate = {
      isActive: data.isActive,
      updatedAt: new Date(),
    } as BaseModel;
    await this.updateOneNonReturning(this.dbSchema.companiesTable, toUpdate, this.dbSchema.companiesTable.id, existingUser.id);
    return true;
  }
}
