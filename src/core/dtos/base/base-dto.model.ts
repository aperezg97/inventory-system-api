import { ApiProperty } from "@nestjs/swagger";

export class BaseDTOModel {
    @ApiProperty({type: 'boolean'})
    isActive: boolean;

    @ApiProperty({type: 'string', example: new Date() })
    createdAt: Date;
    @ApiProperty({type: 'string' })
    createdBy: string;
    @ApiProperty({type: 'string', example: new Date() })
    updatedAt: Date;
    @ApiProperty({type: 'string' })
    updatedBy?: string;
}