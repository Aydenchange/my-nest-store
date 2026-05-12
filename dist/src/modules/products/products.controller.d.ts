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
    create(createProductDto: CreateProductDto): import("@prisma/client").Prisma.Prisma__ProductClient<{
        name: string;
        price: number;
        id: number;
        tenantId: string;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    getProductById(id: number): Promise<any>;
    updateProduct(id: number, dto: CreateProductDto): Promise<{
        name: string;
        price: number;
        id: number;
        tenantId: string;
        createdAt: Date;
    }>;
}
