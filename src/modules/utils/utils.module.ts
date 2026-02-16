import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { CacheService } from './cache.service';

@Module({
    providers: [
        CacheService,
        LoggerService,
    ],
    exports: [
        CacheService,
        LoggerService
    ],
})
export class UtilsModule { }
