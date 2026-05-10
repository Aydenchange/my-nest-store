import { PrismaService } from '../prisma.service';
import { CreateProductDto } from '../../dto/create-product.dto';
import { TenantService } from '../tenant/tenant.service';
import { GetProductsQueryDto } from '../../dto/get-products-query.dto';
export declare class ProductsService {
    private readonly prisma;
    private readonly tenantService;
    constructor(prisma: PrismaService, tenantService: TenantService);
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
    create(dto: CreateProductDto): import("../../generated/prisma").Prisma.Prisma__ProductClient<{
        name: string;
        price: number;
        id: number;
        tenantId: string;
        createdAt: Date;
    }, never, import("../../generated/prisma/runtime/client").DefaultArgs, import("../../generated/prisma").Prisma.PrismaClientOptions>;
}
