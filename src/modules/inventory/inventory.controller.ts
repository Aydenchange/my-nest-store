import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class InventoryController {
  // 关键点：不再使用 @Post，而是监听 'deduct_inventory' 这个消息
  @MessagePattern('deduct_inventory')
  deductStock(@Payload() data: { productId: number; quantity: number }) {
    console.log(
      `[库存微服务] 收到指令：扣减商品 ${data.productId} 的库存 ${data.quantity} 件`,
    );

    // 模拟扣减库存逻辑
    const success = data.quantity <= 100; // 假设库存只有100

    return {
      success,
      message: success ? '库存扣减成功' : '库存不足',
      remaining: success ? 100 - data.quantity : 100,
    };
  }
}
