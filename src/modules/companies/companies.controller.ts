import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Put } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompanyModel } from 'src/core/models';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { RequestModel } from 'src/core/models/api';
import { HttpResponseModel, ToggleStatusModel } from 'src/core/dtos';
import { AuthHelper } from 'src/utils/helpers/auth-helper';
import { StringHelper } from 'src/utils/helpers';

@ApiTags('Companies')
@Controller('api/v1/companies')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  async findAll(): Promise<HttpResponseModel<CompanyModel[]>> {
    const result = await this.companiesService.findAll();
    return HttpResponseModel.okResponse(result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<HttpResponseModel<CompanyModel | string | undefined>> {
    StringHelper.ValidateUUIDParameter(id);
    const result = await this.companiesService.findOne(id);
    if (!result) {
      return HttpResponseModel.notFoundResponse("Item not found");
    }
    return HttpResponseModel.okResponse(result);
  }

  @Post()
  create(@Req() req: RequestModel, @Body() createCompanyDto: CompanyModel) {
    AuthHelper.ValidateLoggedUser(req);
    createCompanyDto.createdBy = req.user.id;
    createCompanyDto.createdAt = new Date();
    createCompanyDto.updatedBy = undefined;
    createCompanyDto.updatedAt = new Date();
    const result = this.companiesService.create(createCompanyDto);
    if (!result) {
      return HttpResponseModel.internalServerErrorResponse();
    }
    return HttpResponseModel.okResponse(true);
  }

  @Put()
  update(@Req() req: RequestModel, @Body() updateCompanyDto: CompanyModel): HttpResponseModel<any> {
    AuthHelper.ValidateLoggedUser(req);
    updateCompanyDto.updatedBy = req.user.id;
    updateCompanyDto.updatedAt = new Date();
    const result = this.companiesService.update(updateCompanyDto);
    if (!result) {
      return HttpResponseModel.badRequestResponse("Item not found");
    }
    return HttpResponseModel.okResponse(true);
  }

  @Patch('/update-status/:id')
  @ApiBody({ type: ToggleStatusModel })
  @ApiResponse({ status: 200, description: 'The record has been successfully created.', type: Boolean })
  async toggleActiveStatus(@Param('id') id: string, @Body() data: ToggleStatusModel) {
    const result = await this.companiesService.toggleActiveStatus(id, data);
    return HttpResponseModel.okResponse(result);
  }
}
