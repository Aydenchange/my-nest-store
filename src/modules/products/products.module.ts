import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma.service';
import { TenantModule } from '../tenant/tenant.module';

@Module({
  imports: [TenantModule, JwtModule.register({ secret: 'SECRET_KEY' })],
  controllers: [ProductsController], // 注册控制器
  providers: [ProductsService, PrismaService], // 注册服务
})
export class ProductsModule {}
