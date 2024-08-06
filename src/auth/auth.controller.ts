import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiBody({ type: LoginDTO })
  signIn(@Body() signInDto: LoginDTO) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }
}
