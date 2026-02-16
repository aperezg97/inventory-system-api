import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmployeeDTO, LoginDTO, UserDTO } from 'src/core/dtos';
import { User } from 'src/core/models';
import { LoginResponseDTO } from 'src/core/dtos/login-response.model';
import { UsersService } from 'src/modules/users/users.service';
import { EmployeesService } from '../employees/employees.service';
import { JWTModel } from 'src/core/models/api/jwt.model';
import { CacheService } from '../utils/cache.service';
import { Constants } from '../utils/constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private employeeService: EmployeesService,
    private jwtService: JwtService,
    private cacheService: CacheService
  ) {}

  async signIn(
    signInDto: LoginDTO
  ): Promise<LoginResponseDTO> {
    const userMatch = await this.usersService.findByUsername(signInDto.username, signInDto.companyId) as User;
    if (!userMatch || userMatch?.password !== signInDto.password) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }
    const employee = await this.employeeService.findByUserID(userMatch.id);
    const payload = { sub: userMatch.id, username: userMatch.username, companyId: userMatch.companyId } as JWTModel;
    delete userMatch.password;
    const accessToken = await this.jwtService.signAsync(payload);
    const decoded: JWTModel = this.jwtService.decode(accessToken);
    return {
      access_token: accessToken,
      user: new UserDTO().fromUser(userMatch),
      employee: employee ? new EmployeeDTO().fromEmployee(employee) : null,
      iat: decoded.iat,
      exp: decoded.exp,
    } as LoginResponseDTO;
  }

  async register(user: User): Promise<User | undefined> {
    const result = await this.usersService.insert(user);
    return result;
  }

  async logout(companyId: string, userId: string): Promise<boolean> {
    // TODO: Handle tokens in DB to then disable it
    const userSessionCacheKeys = [companyId, ...Constants.USER_SESSION_CACHE_KEYS, userId];
    this.cacheService.deleteFromCache(userSessionCacheKeys)
    return true;
  }
}
