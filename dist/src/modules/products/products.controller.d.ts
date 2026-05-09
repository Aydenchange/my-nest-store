import { ProductsService } from './products.service';
import { CreateProductDto } from '../../dto/create-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    getAllProducts(): import("../../generated/prisma").Prisma.PrismaPromise<{
        name: string;
        price: number;
        id: number;
        tenantId: string;
        createdAt: Date;
    }[]>;
    create(createProductDto: CreateProductDto): import("../../generated/prisma").Prisma.Prisma__ProductClient<{
        name: string;
        price: number;
        id: number;
        tenantId: string;
        createdAt: Date;
    }, never, import("../../generated/prisma/runtime/client").DefaultArgs, import("../../generated/prisma").Prisma.PrismaClientOptions>;
}
