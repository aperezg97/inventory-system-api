import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
    @ApiProperty({type: 'string' })
    username: string;
    @ApiProperty({type: 'string' })
    password: string;
    @ApiProperty({type: 'string' })
    companyId: string;
  }