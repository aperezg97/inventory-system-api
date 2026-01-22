import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from 'src/core/dtos';
import { User } from 'src/core/models';
import { LoginResponseDTO } from 'src/core/dtos/login-response.model';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<LoginResponseDTO> {
    const userMatch = await this.usersService.findByUsername(username) as User;
    if (!userMatch || userMatch?.password !== pass) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }
    const payload = { sub: userMatch.id, username: userMatch.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: new UserDTO().fromUser(userMatch),
    } as LoginResponseDTO;
  }

  async register(user: User): Promise<User | undefined> {
    const result = await this.usersService.insert(user);
    return result;
  }
}
