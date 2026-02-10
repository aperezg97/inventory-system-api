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
import { LoginResponseDTO } from 'src/core/dtos/login-response.model';
import { UsersService } from 'src/modules/users/users.service';
import { AuthUserProfile } from 'src/core/dtos/auth-user-profile.model';
import { EmployeesService } from '../employees/employees.service';
import { EmployeeDTO } from 'src/core/dtos/employee-dto.model';
import { JWTModel } from 'src/core/models';
import { isUUID } from 'src/utils/helpers';

@Controller('api/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private employeesService: EmployeesService
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiBody({ type: LoginDTO, examples: {
    user0: { summary: 'user-0', value: { username: 'alex', password: 'alexperez', companyId: '00000000-0000-0000-0000-000000000000' } as LoginDTO } as ExampleObject,
    user1: { summary: 'user-1', value: { username: 'john', password: 'changeme', companyId: '00000000-0000-0000-0000-000000000000' } as LoginDTO } as ExampleObject,
    user2: { summary: 'user-2', value: { username: 'maria', password: 'guess', companyId: '00000000-0000-0000-0000-000000000000' } as LoginDTO } as ExampleObject,
  } as ExamplesObject })
  async signIn(@Body() signInDto: LoginDTO): Promise<HttpResponseModel<LoginResponseDTO>> {
    if (!isUUID(signInDto.companyId ?? '')) {
      return HttpResponseModel.badRequestResponse("CompanyId does not have the required format");
    }
    // TODO: improve this
    if (!signInDto.password.endsWith("==")) {
      signInDto.password += "==";
    }
    let hashedPassCombination = atob(signInDto.password);
    signInDto.password = hashedPassCombination.split('|')[0]; // pass|companyId
    const result = await this.authService.signIn(signInDto);
    return HttpResponseModel.okResponse(result);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  @ApiBody({ type: UserDTO, examples: {
    // user1: { summary: 'user 1', value: { firstName: 'Alex', lastName: 'Perez', email: 'test@test.com', username: 'alex', password: 'alexperez' } as UserDTO } as ExampleObject,
    // user2: { summary: 'user 2', value: { firstName: 'konrix', lastName: 'coderthemes', email: 'konrix@coderthemes.com', username: 'konrix', password: 'konrix' } as UserDTO } as ExampleObject,
    user1: { summary: 'user 1', value: { email: 'test@test.com', username: 'alex', password: 'alexperez' } as UserDTO } as ExampleObject,
    user2: { summary: 'user 2', value: { email: 'konrix@coderthemes.com', username: 'konrix', password: 'konrix' } as UserDTO } as ExampleObject,
  } as ExamplesObject })
  async register(@Body() user: UserDTO) {
    try {
      const result = await this.authService.register(new UserDTO().toUser(user));
      return result;
    } catch(ex) {
      console.log('catch', {ex});
      throw new HttpException(ex.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  async getProfile(@Request() req: any): Promise<AuthUserProfile | HttpResponseModel<any>> {
    if (!(req.user as JWTModel)) {
      return HttpResponseModel.notFoundResponse('User Not Authenticated ');
    }
    const sessionUser = req.user as JWTModel;
    const user = await this.usersService.findByID(sessionUser.sub);
    const employeeInfo = await this.employeesService.findByUserID(user.id);
    return {
      employee: employeeInfo ? new EmployeeDTO().fromEmployee(employeeInfo) : null,
      user: user ? new UserDTO().fromUser(user) : null,
      iat: req.user.iat,
      exp: req.user.exp,
    } as AuthUserProfile;
  }
}
