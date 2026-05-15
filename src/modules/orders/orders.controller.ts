import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject('INVENTORY_SERVICE') private client: ClientProxy, // 注入信使
    @Inject('MESSAGE_BROKER') private messageBroker: ClientProxy, // 注入消息代理
  ) {}

  @Post('create')
  async createOrder(@Body() dto: { productId: number; quantity: number }) {
    console.log(`[API网关] 收到前端创单请求，正在联系库存微服务...`);

    // 使用 client.send 发送消息，并通过 firstValueFrom 把 Observable 转为 Promise
    const inventoryResult = await firstValueFrom(
      this.client.send('deduct_inventory', dto),
    );

    if (!inventoryResult.success) {
      return {
        code: 400,
        message: '下单失败',
        detail: inventoryResult.message,
      };
    }

    return { code: 200, message: '下单成功，库存已扣减' };
  }

  @Post('pay')
  async payOrder(@Body() dto: { orderId: string }) {
    console.log(`[网关] 订单 ${dto.orderId} 支付成功！`);

    // 使用 emit 而不是 send。emit 用于发送“事件”，不等待返回。
    this.messageBroker.emit('order_paid', {
      orderId: dto.orderId,
      amount: 99.9,
      email: 'user@example.com',
    });

    return { status: 'success', message: '支付处理中，您可以关闭页面了' };
  }
}
