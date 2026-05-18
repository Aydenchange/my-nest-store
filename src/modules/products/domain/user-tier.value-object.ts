// 这是一个值对象 (Value Object)，没有 ID，只有值
export class UserTier {
  constructor(public readonly level: 'REGULAR' | 'VIP' | 'SVIP') {}

  get discountRate(): number {
    if (this.level === 'SVIP') return 0.2; // 八折
    if (this.level === 'VIP') return 0.1; // 九折
    return 0; // 原价
  }
}
