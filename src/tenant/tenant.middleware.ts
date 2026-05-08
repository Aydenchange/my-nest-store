import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantService } from './tenant.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  // 注意：虽然 Middleware 运行在 Service 之前，但 Nest 允许在这里注入它
  constructor(private readonly tenantService: TenantService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id'] as string;
    if (!tenantId) {
      // 真实场景这里会抛出异常，今天先简化
      this.tenantService.setTenantId('public');
    } else {
      this.tenantService.setTenantId(tenantId);
    }
    next();
  }
}
