import { ProductsService } from './products.service';
import { CreateProductDto } from '../../dto/create-product.dto';
import { GetProductsQueryDto } from '../../dto/get-products-query.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    getAllProducts(query: GetProductsQueryDto): Promise<{
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
    create(createProductDto: CreateProductDto): import("../../generated/prisma").Prisma.Prisma__ProductClient<{
        name: string;
        price: number;
        id: number;
        tenantId: string;
        createdAt: Date;
    }, never, import("../../generated/prisma/runtime/client").DefaultArgs, import("../../generated/prisma").Prisma.PrismaClientOptions>;
}
