import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantMiddleware } from './tenant.middleware';
import { TenantPrismaProvider } from './tenant-prisma.provider';

@Module({
  providers: [TenantService, TenantPrismaProvider],
  exports: [TenantService, TenantPrismaProvider], // 导出给其他模块使用
})
export class TenantModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*'); // 全局应用中间件
  }
}
