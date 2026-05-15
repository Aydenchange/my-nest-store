import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

type OrderPaidEvent = {
  orderId: string;
  amount: number;
  email: string;
};

@Controller()
export class PointsController {
  @EventPattern('order_paid')
  handleOrderPaid(@Payload() data: OrderPaidEvent) {
    console.log(`[积分服务] 订单 ${data.orderId} 成功，已为用户增加 100 积分`);
  }
}
