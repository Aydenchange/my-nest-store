import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import OSS from 'ali-oss';

type UploadJobData = {
  filename: string;
  buffer: Buffer;
  mimetype: string;
};

type OssPutResult = {
  url: string;
};

type OssClient = {
  put: (name: string, file: Buffer) => Promise<OssPutResult>;
};

type OssConstructor = new (options: {
  region?: string;
  accessKeyId?: string;
  accessKeySecret?: string;
  bucket?: string;
}) => OssClient;

const OSSClient = OSS as unknown as OssConstructor;

@Processor('image-upload')
export class UploadProcessor extends WorkerHost {
  private readonly client: OssClient;

  constructor() {
    super();
    this.client = new OSSClient({
      region: process.env.ALICLOUD_OSS_REGION,
      accessKeyId: process.env.ALICLOUD_OSS_ACCESS_KEY,
      accessKeySecret: process.env.ALICLOUD_OSS_SECRET_KEY,
      bucket: process.env.ALICLOUD_OSS_BUCKET,
    });
  }

  async process(job: Job<UploadJobData>): Promise<string> {
    const { filename, buffer } = job.data;

    // 模拟耗时操作，如缩略图处理
    await new Promise((res) => setTimeout(res, 2000));

    try {
      const result = await this.client.put(
        `products/${Date.now()}-${filename}`,
        Buffer.from(buffer),
      );
      console.log(`Job ${job.id} 完成: ${result.url}`);
      return result.url;
    } catch (err) {
      console.error('上传失败，自动触发重试');
      throw err; // 抛出错误，BullMQ 会根据配置自动重试
    }
  }
}
