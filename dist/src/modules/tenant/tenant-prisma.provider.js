"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantPrismaProvider = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const tenant_service_1 = require("./tenant.service");
const connectionPool = new Map();
exports.TenantPrismaProvider = {
    provide: 'PRISMA_CLIENT',
    scope: common_1.Scope.REQUEST,
    inject: [tenant_service_1.TenantService],
    useFactory: (tenantService) => {
        const tenantId = tenantService.getTenantId();
        if (connectionPool.has(tenantId)) {
            return connectionPool.get(tenantId);
        }
        const dbUrl = tenantId === 'VIP_CLIENT'
            ? process.env.TENANT_A_DB_URL
            : process.env.DATABASE_URL;
        if (!dbUrl) {
            throw new Error(`Database URL is not configured for tenant: ${tenantId}`);
        }
        const adapter = new adapter_pg_1.PrismaPg({ connectionString: dbUrl });
        const client = new client_1.PrismaClient({ adapter });
        connectionPool.set(tenantId, client);
        return client;
    },
};
//# sourceMappingURL=tenant-prisma.provider.js.map