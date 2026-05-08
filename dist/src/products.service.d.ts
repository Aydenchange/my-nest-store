import { PrismaService } from './prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): import("./generated/prisma").Prisma.PrismaPromise<{
        name: string;
        price: number;
        id: number;
        tenantId: string;
        createdAt: Date;
    }[]>;
    create(dto: CreateProductDto): import("./generated/prisma").Prisma.Prisma__ProductClient<{
        name: string;
        price: number;
        id: number;
        tenantId: string;
        createdAt: Date;
    }, never, import("./generated/prisma/runtime/client").DefaultArgs, import("./generated/prisma").Prisma.PrismaClientOptions>;
}
