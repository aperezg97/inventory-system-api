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
import { HttpResponseModel, LoginDTO, UserDTO } from 'src/core/dtos';
import { ExampleObject, ExamplesObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { User } from 'src/core/models';
import { LoginResponseDTO } from 'src/core/dtos/login-response.model';
import { UsersService } from 'src/modules/users/users.service';
import { AuthUserProfile } from 'src/core/dtos/auth-user-profile.model';

@Controller('api/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService,
    private usersService: UsersService
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiBody({ type: LoginDTO, examples: {
    user0: { summary: 'user-0', value: { username: 'alex', password: 'alexperez' } as LoginDTO } as ExampleObject,
    user1: { summary: 'user-1', value: { username: 'john', password: 'changeme' } as LoginDTO } as ExampleObject,
    user2: { summary: 'user-2', value: { username: 'maria', password: 'guess' } as LoginDTO } as ExampleObject,
  } as ExamplesObject })
  signIn(@Body() signInDto: LoginDTO): Promise<LoginResponseDTO> {
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
      const result = await this.authService.register(new UserDTO().toUser(user));
      return result;
    } catch(ex) {
      throw new HttpException(ex.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  async getProfile(@Request() req: any): Promise<AuthUserProfile | HttpResponseModel<any>> {
    if (!req.user) {
      return HttpResponseModel.notFoundResponse('User Not Authenticated ');
    }
    const user = await this.usersService.findByID(req.user.sub);
    if (!user) {
      return HttpResponseModel.notFoundResponse('Authenticated User not found');
    }
    return {
      user: new UserDTO().fromUser(user),
      iat: req.user.iat,
      exp: req.user.exp,
    } as AuthUserProfile;
  }
}
