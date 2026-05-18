import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, Product } from '@prisma/client';
import { CreateProductDto } from '../../dto/create-product.dto';
import { TenantService } from '../tenant/tenant.service';
import { GetProductsQueryDto } from '../../dto/get-products-query.dto';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { ProductEntity } from './domain/product.entity';
import { ProductMapper } from './mappers/product.mapper';
import { UserTier } from './domain/user-tier.value-object';
import { PriceCalculatorService } from './domain/price-calculator.service';

@Injectable()
export class ProductsService {
  constructor(
    // 注意：这里不再注入具体的 PrismaService，而是注入我们定义的字符串 Token
    @Inject('PRISMA_CLIENT') private readonly prisma: PrismaClient,
    private readonly tenantService: TenantService, // 注入租户上下文
    @InjectRedis() private readonly redis: Redis, // 注入 Redis 实例
  ) {}

  // 场景：商品调价并计算针对特定用户的结算价
  async adjustAndCalculate(
    id: number,
    newBasePrice: number,
    userLevel: 'REGULAR' | 'VIP' | 'SVIP',
  ) {
    const tenantId = this.tenantService.getTenantId();

    // 1. 读取 PO
    const po = await this.prisma.product.findUnique({
      where: { id, tenantId },
    });
    if (!po) throw new BadRequestException('商品不存在');

    // 2. 通过 Mapper 转换为领域实体 (进入领域边界)
    const product = ProductMapper.toDomain(po);

    // 3. 执行实体业务方法（修改价格）
    product.updatePrice(newBasePrice);

    // 4. 通过 Mapper 转换回 PO，持久化回数据库
    const updatedPo = ProductMapper.toPersistence(product);
    await this.prisma.product.update({
      where: { id: product.id },
      data: { price: updatedPo.price, name: updatedPo.name },
    });

    // 5. 实例化其他领域对象，调用领域服务进行多对象协同计算
    const tier = new UserTier(userLevel);
    const storeDiscount = 20; // 模拟当前商户后台配置的满减：减20元

    const finalPrice = PriceCalculatorService.calculate(
      product,
      tier,
      storeDiscount,
    );

    return {
      productId: product.id,
      newName: product.name,
      adjustedBasePrice: product.price,
      clientFinalPrice: finalPrice,
    };
  }

  async getProductPriceWithDiscount(
    id: number,
    discountType: 'PERCENTAGE' | 'FLAT',
    discountValue: number,
  ) {
    const tenantId = this.tenantService.getTenantId();

    // 1. 从数据库读取原始数据 (PO - Persistent Object)
    const dbData = await this.prisma.product.findUnique({
      where: { id, tenantId },
    });
    if (!dbData) throw new BadRequestException('商品不存在');

    // 2. 将数据转化为具备业务能力的“领域实体 (Entity)”
    const product = new ProductEntity(
      dbData.id,
      dbData.name,
      dbData.price,
      dbData.tenantId,
    );

    // 3. 调用实体内部的业务逻辑，Service 绝不自己写 if-else 计算
    const finalPrice = product.calculateFinalPrice({
      type: discountType,
      value: discountValue,
    });

    return {
      originalPrice: product.price,
      finalPrice: finalPrice,
    };
  }

  async findAll(query: GetProductsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const { search } = query;

    // 计算跳过的条数
    const skip = (page - 1) * limit;

    // 并发执行：获取数据列表 + 获取总数（用于前端展示分页器）
    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where: {
          tenantId: this.tenantService.getTenantId(),
          name: search ? { contains: search } : undefined, // 模糊搜索
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({
        where: {
          tenantId: this.tenantService.getTenantId(),
          name: search ? { contains: search } : undefined,
        },
      }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        ...dto,
        tenantId: this.tenantService.getTenantId(), // 动态注入租户 ID
      },
    });
  }

  async findOne(id: number) {
    const tenantId = this.tenantService.getTenantId();
    const cacheKey = `tenant:${tenantId}:product:${id}`;

    // 1. 尝试从 Redis 获取
    const cachedProduct = await this.redis.get(cacheKey);
    if (cachedProduct) {
      return JSON.parse(cachedProduct) as Product; // 命中缓存，直接返回
    }

    // 2. 缓存失效，查询数据库
    const product = await this.prisma.product.findUnique({
      where: { id, tenantId },
    });

    if (product) {
      // 3. 写入缓存，设置 1 小时过期 (3600秒)
      await this.redis.set(cacheKey, JSON.stringify(product), 'EX', 3600);
    }

    return product;
  }

  // 4. 当商品更新时，必须删除缓存
  async update(id: number, dto: Prisma.ProductUpdateInput) {
    const tenantId = this.tenantService.getTenantId();
    const updated = await this.prisma.product.update({
      where: { id, tenantId },
      data: dto,
    });

    // 关键：删除缓存（Invalidation）
    await this.redis.del(`tenant:${tenantId}:product:${id}`);
    return updated;
  }
}
