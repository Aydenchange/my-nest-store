import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';

@Module({
  controllers: [MetricsController], // 注册控制器
})
export class MetricsModule {}
