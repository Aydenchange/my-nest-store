export interface DiscountPolicy {
  type: 'PERCENTAGE' | 'FLAT';
  value: number;
}

export class ProductEntity {
  constructor(
    public readonly id: number,
    public name: string,
    private _price: number, // 设为私有，不允许外部直接修改
    public readonly tenantId: string,
  ) {
    if (_price < 0) throw new Error('商品初始化价格不能为负数');
  }

  // 暴露只读的价格
  get price(): number {
    return this._price;
  }

  /**
   * 业务核心：计算折扣后的最终价格（充血模型的方法）
   */
  public calculateFinalPrice(policy?: DiscountPolicy): number {
    if (!policy) return this._price;

    switch (policy.type) {
      case 'PERCENTAGE':
        // 例如：0.2 代表打八折
        return this._price * (1 - policy.value);
      case 'FLAT':
        // 例如：减免 50 元
        return Math.max(0, this._price - policy.value);
      default:
        return this._price;
    }
  }

  /**
   * 业务核心：修改商品价格（自带业务规则校验）
   */
  public updatePrice(newPrice: number) {
    if (newPrice <= 0) {
      throw new Error('修改后的价格必须大于零');
    }
    this._price = newPrice;
  }
}
