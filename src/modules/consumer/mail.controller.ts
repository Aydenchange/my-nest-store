import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

type OrderPaidEvent = {
  orderId: string;
  amount: number;
  email: string;
};

@Controller()
export class MailController {
  @EventPattern('order_paid')
  handleOrderPaid(@Payload() data: OrderPaidEvent) {
    console.log(`[邮件服务] 正在向 ${data.email} 发送收据...`);
  }
}
