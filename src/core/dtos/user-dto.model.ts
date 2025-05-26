import { ApiProperty } from "@nestjs/swagger";

export class UserDTO {
    @ApiProperty({type: 'string' })
    id: string;
    @ApiProperty({type: 'string' })
    firstName: string;
    @ApiProperty({type: 'string' })
    lastName: string;
    @ApiProperty({type: 'string' })
    email: string;
    @ApiProperty({type: 'string' })
    username: string;
    @ApiProperty({type: 'string' })
    password: string;
    @ApiProperty({type: 'string', example: new Date() })
    created_at: Date;
    @ApiProperty({type: 'string' })
    created_by: string;
    @ApiProperty({type: 'string', example: new Date() })
    updated_at: Date;
    @ApiProperty({type: 'string' })
    updated_by: string;
}