import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { TenantService } from './tenant/tenant.service';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService, // 注入数据库服务
    private tenantService: TenantService, // 注入租户上下文
  ) {}

  findAll() {
    return this.prisma.product.findMany();
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
