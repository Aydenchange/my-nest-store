import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { FileInterceptor } from '@nestjs/platform-express';

type UploadInputFile = {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
};

@Controller('upload')
export class UploadController {
  constructor(
    @InjectQueue('image-upload') private readonly imageQueue: Queue,
  ) {}

  @Post('upload-async')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAsync(@UploadedFile() file: UploadInputFile) {
    if (!file || !file.buffer) {
      throw new BadRequestException('请上传文件');
    }

    const job = await this.imageQueue.add('oss-upload', {
      filename: file.originalname,
      buffer: file.buffer,
      mimetype: file.mimetype,
    });

    return { jobId: job.id, message: '任务已进入队列' };
  }
}
