import { Scope } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { TenantService } from './tenant.service';

// 这是一个缓存连接的单例容器（非 Request Scope）
const connectionPool = new Map<string, PrismaClient>();

export const TenantPrismaProvider = {
  provide: 'PRISMA_CLIENT',
  scope: Scope.REQUEST, // 每个请求进来重新计算
  inject: [TenantService],
  useFactory: (tenantService: TenantService) => {
    const tenantId = tenantService.getTenantId();

    // 1. 如果缓存里有这个租户的连接，直接返回
    if (connectionPool.has(tenantId)) {
      return connectionPool.get(tenantId);
    }

    // 2. 根据 tenantId 获取对应的连接字符串
    // 实际项目中这里应该查主控库，现在我们简单模拟逻辑
    const dbUrl =
      tenantId === 'VIP_CLIENT'
        ? process.env.TENANT_A_DB_URL
        : process.env.DATABASE_URL;

    if (!dbUrl) {
      throw new Error(`Database URL is not configured for tenant: ${tenantId}`);
    }

    // 3. 创建新的 Prisma 实例
    const adapter = new PrismaPg({ connectionString: dbUrl });
    const client = new PrismaClient({ adapter });

    // 4. 存入缓存并返回
    connectionPool.set(tenantId, client);
    return client;
  },
};
