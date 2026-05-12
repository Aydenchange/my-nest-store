"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const tenant_service_1 = require("../tenant/tenant.service");
const ioredis_1 = require("ioredis");
const ioredis_2 = require("@nestjs-modules/ioredis");
let ProductsService = class ProductsService {
    prisma;
    tenantService;
    redis;
    constructor(prisma, tenantService, redis) {
        this.prisma = prisma;
        this.tenantService = tenantService;
        this.redis = redis;
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const { search } = query;
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.prisma.product.findMany({
                where: {
                    tenantId: this.tenantService.getTenantId(),
                    name: search ? { contains: search } : undefined,
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
    create(dto) {
        return this.prisma.product.create({
            data: {
                ...dto,
                tenantId: this.tenantService.getTenantId(),
            },
        });
    }
    async findOne(id) {
        const tenantId = this.tenantService.getTenantId();
        const cacheKey = `tenant:${tenantId}:product:${id}`;
        const cachedProduct = await this.redis.get(cacheKey);
        if (cachedProduct) {
            return JSON.parse(cachedProduct);
        }
        const product = await this.prisma.product.findUnique({
            where: { id, tenantId },
        });
        if (product) {
            await this.redis.set(cacheKey, JSON.stringify(product), 'EX', 3600);
        }
        return product;
    }
    async update(id, dto) {
        const tenantId = this.tenantService.getTenantId();
        const updated = await this.prisma.product.update({
            where: { id, tenantId },
            data: dto,
        });
        await this.redis.del(`tenant:${tenantId}:product:${id}`);
        return updated;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, ioredis_2.InjectRedis)()),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tenant_service_1.TenantService,
        ioredis_1.Redis])
], ProductsService);
//# sourceMappingURL=products.service.js.map