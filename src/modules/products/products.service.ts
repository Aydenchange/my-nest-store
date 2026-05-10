import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProductDto } from '../../dto/create-product.dto';
import { TenantService } from '../tenant/tenant.service';
import { GetProductsQueryDto } from '../../dto/get-products-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService, // 注入数据库服务
    private readonly tenantService: TenantService, // 注入租户上下文
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
}
