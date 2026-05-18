import { Body, Controller, Get, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { BranchOfficesService } from './branch-offices.service';
import { BranchOfficeModel } from 'src/core/models';
import { HttpResponseModel, ToggleStatusModel } from 'src/core/dtos';
import { AuthHelper, StringHelper } from 'src/utils/helpers';
import { RequestModel } from 'src/core/models/api';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('BranchOffices')
@Controller('api/v1/branch-offices')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class BranchOfficesController {
    constructor(private readonly branchOfficesService: BranchOfficesService
    ) { }

    @Get()
    @ApiResponse({ status: 200, type: HttpResponseModel<BranchOfficeModel[]> })
    async findAll(@Req() req: RequestModel): Promise<HttpResponseModel<BranchOfficeModel[]>> {
        let result = await this.branchOfficesService.findAllByCompany(req.companyId);
        result = result.map(x => {
            x.company = x.company || req.user.company;
            return x;
        });
        return HttpResponseModel.okResponse(result);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Req() req: RequestModel): Promise<HttpResponseModel<BranchOfficeModel | string | undefined>> {
        StringHelper.ValidateUUIDParameter(id);
        const result = await this.branchOfficesService.findOne(id, req.companyId);
        if (!result) {
            return HttpResponseModel.notFoundResponse("Item not found");
        }
        return HttpResponseModel.okResponse(result);
    }

    @Post()
    async create(@Req() req: RequestModel, @Body() createCompanyDto: BranchOfficeModel): Promise<HttpResponseModel<any>> {
        AuthHelper.ValidateLoggedUser(req);
        createCompanyDto.createdBy = req.user.id;
        createCompanyDto.updatedBy = undefined;
        const result = await this.branchOfficesService.create(createCompanyDto);
        if (!result) {
            return HttpResponseModel.internalServerErrorResponse();
        }
        return HttpResponseModel.okResponse(true);
    }

    @Put()
    async update(@Req() req: RequestModel, @Body() updateCompanyDto: BranchOfficeModel): Promise<HttpResponseModel<any>> {
        AuthHelper.ValidateLoggedUser(req);
        updateCompanyDto.updatedBy = req.user.id;
        const result = await this.branchOfficesService.update(updateCompanyDto);
        if (!result) {
            return HttpResponseModel.badRequestResponse("Item not found");
        }
        return HttpResponseModel.okResponse(true);
    }

    @Patch('/update-status/:id')
    @ApiBody({ type: ToggleStatusModel })
    @ApiResponse({ status: 200, description: 'The record has been successfully created.', type: Boolean })
    async toggleActiveStatus(@Param('id') id: string, @Req() req: RequestModel, @Body() data: ToggleStatusModel): Promise<HttpResponseModel<any>> {
        const result = await this.branchOfficesService.toggleActiveStatus(id, req.companyId, data);
        return HttpResponseModel.okResponse(result);
    }
}
