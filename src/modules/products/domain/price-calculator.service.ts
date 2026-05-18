import { ProductEntity } from './product.entity';
import { UserTier } from './user-tier.value-object';

export class PriceCalculatorService {
  /**
   * 核心算法：结合商品、用户等级、店铺满减计算最终价
   */
  public static calculate(
    product: ProductEntity,
    userTier: UserTier,
    storeFlatDiscount: number,
  ): number {
    // 1. 获取商品基础价
    let price = product.price;

    // 2. 应用用户等级折扣
    price = price * (1 - userTier.discountRate);

    // 3. 应用店铺满减
    price = Math.max(0, price - storeFlatDiscount);

    return price;
  }
}
