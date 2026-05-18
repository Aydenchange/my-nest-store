import { Product as PrismaProduct } from '@prisma/client';
import { ProductEntity } from '../domain/product.entity';

export class ProductMapper {
  /**
   * 将数据库 PO 转换为 领域 Entity
   */
  public static toDomain(po: PrismaProduct): ProductEntity {
    return new ProductEntity(
      po.id,
      po.name,
      po.price, // 映射到 Entity 内部
      po.tenantId,
    );
  }

  /**
   * 将领域 Entity 转换为 数据库可保存的纯 JSON (PO)
   */
  public static toPersistence(entity: ProductEntity): Partial<PrismaProduct> {
    return {
      id: entity.id,
      name: entity.name,
      price: entity.price, // 通过 getter 拿到最新价格
      tenantId: entity.tenantId,
    };
  }
}
