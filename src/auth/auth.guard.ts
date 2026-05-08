import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) throw new UnauthorizedException('未提供登录凭证');

    try {
      // 验证 Token 并将用户信息挂载到 Request 上
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'SECRET_KEY',
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('无效的 Token');
    }
    return true;
  }
}
