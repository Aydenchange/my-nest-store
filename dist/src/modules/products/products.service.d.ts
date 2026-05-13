import { PrismaClient } from '@prisma/client';
import { CreateProductDto } from '../../dto/create-product.dto';
import { TenantService } from '../tenant/tenant.service';
import { GetProductsQueryDto } from '../../dto/get-products-query.dto';
import { Redis } from 'ioredis';
export declare class ProductsService {
    private readonly prisma;
    private readonly tenantService;
    private readonly redis;
    constructor(prisma: PrismaClient, tenantService: TenantService, redis: Redis);
    findAll(query: GetProductsQueryDto): Promise<{
        items: {
            name: string;
            price: number;
            id: number;
            tenantId: string;
            createdAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            lastPage: number;
        };
    }>;
    create(dto: CreateProductDto): import("@prisma/client").Prisma.Prisma__ProductClient<{
        name: string;
        price: number;
        id: number;
        tenantId: string;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findOne(id: number): Promise<any>;
    update(id: number, dto: any): Promise<{
        name: string;
        price: number;
        id: number;
        tenantId: string;
        createdAt: Date;
    }>;
}
