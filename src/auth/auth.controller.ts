import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Request,
  Get,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { LoginDTO, UserDTO } from 'src/core/dtos';
import { ExampleObject, ExamplesObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { User } from 'src/core/models';

@Controller('api/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiBody({ type: LoginDTO, examples: {
    user0: { summary: 'user-0', value: { username: 'alex', password: 'alexperez' } as LoginDTO } as ExampleObject,
    user1: { summary: 'user-1', value: { username: 'john', password: 'changeme' } as LoginDTO } as ExampleObject,
    user2: { summary: 'user-2', value: { username: 'maria', password: 'guess' } as LoginDTO } as ExampleObject,
  } as ExamplesObject })
  signIn(@Body() signInDto: LoginDTO) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  @ApiBody({ type: UserDTO, examples: {
    user1: { summary: 'user 1', value: { firstName: 'Alex', lastName: 'Perez', email: 'test@test.com', username: 'alex', password: 'alexperez' } as UserDTO } as ExampleObject,
    user2: { summary: 'user 2', value: { firstName: 'konrix', lastName: 'coderthemes', email: 'konrix@coderthemes.com', username: 'konrix', password: 'konrix' } as UserDTO } as ExampleObject,
  } as ExamplesObject })
  async register(@Body() user: UserDTO) {
    try {
      const result = await this.authService.register(user as User);
      console.log({result});
      return result;
    } catch(ex) {
      console.log('catch', {ex});
      const result = await this.authService.register(user as User);
      return result;
      // throw new HttpException(ex.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  getProfile(@Request() req: any) {
    return req.user;
  }
}
