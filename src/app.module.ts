import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './modules/products/products.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { UploadModule } from './modules/upload/upload.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { OrdersModule } from './modules/orders/orders.module';
import { InventoryModule } from './modules/inventory/inventory.module';

@Module({
  imports: [
    // 1. 先加载配置
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule.forRoot({
      type: 'single',
      url: `redis://${process.env.REDIS_HOST}:6379`,
    }),
    // 2. 加载各个业务集装箱
    TenantModule,
    ProductsModule,
    OrdersModule,
    UploadModule,
  ],
})
export class AppModule {}
