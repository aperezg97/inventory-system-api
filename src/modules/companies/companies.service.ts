import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyModel } from 'src/core/models';
import { BaseService } from '../base/base.service';
import { asc } from 'drizzle-orm';

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
    let result = await this.findOneById<CompanyModel>(id, this.dbSchema.companiesTable.id, this.dbSchema.companiesTable);
    return result;
  }

  async create(createCompanyDto: CompanyModel) {
    createCompanyDto.createdAt = new Date();
    createCompanyDto.updatedAt = new Date();
    const result = await this.dbContext.insert(this.dbSchema.companiesTable).values(createCompanyDto).returning();
    if (!result?.length) {
      return undefined;
    }

  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
