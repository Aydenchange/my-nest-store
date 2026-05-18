import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { InventoryModule } from './modules/inventory/inventory.module';

async function bootstrap() {
  // 创建一个纯微服务应用，使用 TCP 协议，监听 3001 端口
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    InventoryModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 3001,
      },
    },
  );
  await app.listen();
  console.log('📦 库存微服务已启动 (TCP Port: 3001)');
}
void bootstrap();
