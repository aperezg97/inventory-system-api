import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';
import { JWTModel, RequestModel } from 'src/core/models/api';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestModel = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: JWTModel = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      const expirationDate = new Date(payload.exp! * 1000);
      console.log({expirationDate});
      const now = new Date();
      if (now >= expirationDate) {
        throw new UnauthorizedException();
      }
      console.log({
        sub: payload.sub,
      });
      // TODO:
      // Handle caching to store user session?
      const user = await this.userService.findByID(payload.sub);
      console.log({user});
      if (!user) {
        throw new UnauthorizedException();
      }
      delete user.password;
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request.user = user;
      request.companyId = user.companyId;
      request.iat = payload.iat;
      request.exp = payload.exp;
    } catch(ex) {
      console.log({ex});
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request | any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
