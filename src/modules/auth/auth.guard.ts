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
import { CacheService } from '../utils/cache.service';
import { User } from 'src/core/models';
import { Constants } from '../utils/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly USER_SESSION_CACHE_TTL = 10 * 60; // 10 minutes

  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private cacheService: CacheService
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
      const now = new Date();
      if (now >= expirationDate) {
        throw new UnauthorizedException();
      }
      const userSessionCacheKeys = [payload.companyId, ...Constants.USER_SESSION_CACHE_KEYS, payload.sub];
      const cachedUserSession = this.cacheService.getFromCache<User>(userSessionCacheKeys);
      let user!: User;
      if (cachedUserSession) {
        user = cachedUserSession;
      } else {
        user = await this.userService.findByID(payload.sub);
      }
      if (!user) {
        throw new UnauthorizedException();
      }
      delete user.password;
      if (!cachedUserSession) {
        this.cacheService.setToCache(userSessionCacheKeys, user, this.USER_SESSION_CACHE_TTL);
      }
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
