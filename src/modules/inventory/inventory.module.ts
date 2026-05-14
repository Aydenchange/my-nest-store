import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';

@Module({
  controllers: [InventoryController], // 注册控制器
})
export class InventoryModule {}
