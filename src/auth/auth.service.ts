import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from 'src/core/dtos';
import { User } from 'src/core/models';
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
  ): Promise<{ access_token: string, user: any }> {
    const userMatch = await this.usersService.findByUsername(username) as User;
    if (userMatch?.password !== pass) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }
    const payload = { sub: userMatch.id, username: userMatch.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: userMatch.id,
        firstName: userMatch.firstName,
        lastName: userMatch.lastName,
        username: userMatch.username,
        email: userMatch.email,
        created_at: userMatch.created_at,
        updated_at: userMatch.updated_at,
      } as UserDTO,
    };
  }

  async register(user: User): Promise<User | undefined> {
    const result = await this.usersService.insert(user);
    return result;
  }
}
