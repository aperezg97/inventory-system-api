import { ApiProperty } from "@nestjs/swagger";

export class ToggleStatusModel {
    @ApiProperty({type: 'boolean' })
    isActive: boolean;
}