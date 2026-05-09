import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

type RequestWithUser = {
  headers?: Record<string, unknown>;
  user?: Record<string, unknown>;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rawRequest: unknown = context.switchToHttp().getRequest();
    const request = rawRequest as RequestWithUser;
    const authHeader = request.headers?.authorization;

    let token: string | undefined;
    if (typeof authHeader === 'string') {
      token = authHeader.split(' ')[1];
    } else if (Array.isArray(authHeader) && typeof authHeader[0] === 'string') {
      token = authHeader[0].split(' ')[1];
    }

    if (!token) throw new UnauthorizedException('未提供登录凭证');

    try {
      // 验证 Token 并将用户信息挂载到 Request 上
      const payload = await this.jwtService.verifyAsync<
        Record<string, unknown>
      >(token, {
        secret: 'SECRET_KEY',
      });
      request.user = payload;
    } catch {
      throw new UnauthorizedException('无效的 Token');
    }
    return true;
  }
}
