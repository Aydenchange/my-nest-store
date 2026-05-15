import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { PointsController } from './points.controller';

@Module({
  controllers: [MailController, PointsController], // 注册控制器
})
export class ConsumerModule {}
