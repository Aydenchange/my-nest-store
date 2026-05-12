import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProductDto } from '../../dto/create-product.dto';
import { TenantService } from '../tenant/tenant.service';
import { GetProductsQueryDto } from '../../dto/get-products-query.dto';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService, // 注入数据库服务
    private readonly tenantService: TenantService, // 注入租户上下文
    @InjectRedis() private readonly redis: Redis, // 注入 Redis 实例
  ) {}

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
      return JSON.parse(cachedProduct); // 命中缓存，直接返回
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
  async update(id: number, dto: any) {
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
