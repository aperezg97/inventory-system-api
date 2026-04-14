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
    constructor(private readonly branchOfficesService: BranchOfficesService) { }

    @Get()
    @ApiResponse({ status: 200, type: HttpResponseModel<BranchOfficeModel[]> })
    async findAll(@Req() req: RequestModel): Promise<HttpResponseModel<BranchOfficeModel[]>> {
        const result = await this.branchOfficesService.findAllByCompany(req.companyId);
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
    create(@Req() req: RequestModel, @Body() createCompanyDto: BranchOfficeModel) {
        AuthHelper.ValidateLoggedUser(req);
        createCompanyDto.createdBy = req.user.id;
        createCompanyDto.updatedBy = undefined;
        const result = this.branchOfficesService.create(createCompanyDto);
        if (!result) {
            return HttpResponseModel.internalServerErrorResponse();
        }
        return HttpResponseModel.okResponse(true);
    }

    @Put()
    update(@Req() req: RequestModel, @Body() updateCompanyDto: BranchOfficeModel): HttpResponseModel<any> {
        AuthHelper.ValidateLoggedUser(req);
        updateCompanyDto.updatedBy = req.user.id;
        const result = this.branchOfficesService.update(updateCompanyDto);
        if (!result) {
            return HttpResponseModel.badRequestResponse("Item not found");
        }
        return HttpResponseModel.okResponse(true);
    }

    @Patch('/update-status/:id')
    @ApiBody({ type: ToggleStatusModel })
    @ApiResponse({ status: 200, description: 'The record has been successfully created.', type: Boolean })
    async toggleActiveStatus(@Param('id') id: string, @Req() req: RequestModel, @Body() data: ToggleStatusModel) {
        const result = await this.branchOfficesService.toggleActiveStatus(id, req.companyId, data);
        return HttpResponseModel.okResponse(result);
    }
}
