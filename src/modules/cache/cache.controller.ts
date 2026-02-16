import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CacheService } from '../utils/cache.service';
import { HttpResponseModel } from 'src/core/dtos';
import NodeCache = require("node-cache");
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@Controller('api/v1/cache')
// @UseGuards(AuthGuard)
// @ApiBearerAuth()
export class CacheController {
    constructor(private readonly cacheService: CacheService) { }

    @Get('flushAll')
    clearCache(): HttpResponseModel<boolean> {
        this.cacheService.flushAll();
        return HttpResponseModel.okResponse(true);
    }

    @ApiParam({
        name: 'companyId',
        required: false,
        description: 'Filter by Company ID',
        schema: { type: 'string' },
        allowEmptyValue: true
    })
    @Get('flush/{*companyId}')
    flushByCompanyId(@Param('companyId') companyId: string = ''): HttpResponseModel<number> {
        if (Array.isArray(companyId)) {
            companyId = companyId[0];
        }
        const data = this.cacheService.getData();
        let filtered = data;
        let count = 0;
        if (companyId) {
            for (let key in filtered) {
                if (key.startsWith(companyId)) {
                    delete filtered[key];
                    count++;
                }
            }
        }
        return HttpResponseModel.okResponse(count);
    }

    @Get('getStats')
    getStats(): HttpResponseModel<NodeCache.Stats> {
        const stats = this.cacheService.getStats();
        return HttpResponseModel.okResponse(stats);
    }

    @ApiParam({
        name: 'companyId',
        required: false,
        description: 'Filter by Company ID',
        schema: { type: 'string' },
        allowEmptyValue: true
    })
    @Get('getCachedData/{*companyId}')
    getData(@Param('companyId') companyId: string = ''): HttpResponseModel<{[key: string]: any}> {
        if (Array.isArray(companyId)) {
            companyId = companyId[0];
        }
        const data = this.cacheService.getData();
        let filtered = {...data};
        if (companyId) {
            for (let key in filtered) {
                if (!key.startsWith(companyId)) {
                    delete filtered[key];
                }
            }
        }
        return HttpResponseModel.okResponse(filtered);
    }
}
