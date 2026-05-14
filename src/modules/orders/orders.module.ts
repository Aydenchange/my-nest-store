import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrdersController } from './orders.controller';

@Module({
  imports: [
    // 注册微服务客户端
    ClientsModule.register([
      {
        name: 'INVENTORY_SERVICE', // 这是一个注入 Token
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 3001 },
      },
    ]),
  ],
  controllers: [OrdersController],
})
export class OrdersModule {}
