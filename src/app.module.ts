import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './modules/products/products.module';
import { TenantModule } from './modules/tenant/tenant.module';

@Module({
  imports: [
    // 1. 先加载配置
    ConfigModule.forRoot({ isGlobal: true }),
    // 2. 加载各个业务集装箱
    TenantModule,
    ProductsModule,
  ],
})
export class AppModule {}
