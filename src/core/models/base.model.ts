import { ApiProperty } from "@nestjs/swagger";

export class BaseModel {
    @ApiProperty({type: 'boolean' })
    isActive: boolean;

    @ApiProperty()
    createdAt: Date;
    @ApiProperty()
    createdBy: string;
    @ApiProperty()
    updatedAt: Date;
    @ApiProperty()
    updatedBy?: string;
}