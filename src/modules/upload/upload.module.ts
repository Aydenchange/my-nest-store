import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadProcessor } from '../products/upload.processor';

@Module({
  imports: [
    BullModule.forRoot({
      connection: { host: 'localhost', port: 6379 },
    }),
    BullModule.registerQueue({
      name: 'image-upload', // 队列名称
    }),
  ],
  controllers: [UploadController],
  providers: [UploadProcessor],
})
export class UploadModule {}
