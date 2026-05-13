import { Scope } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TenantService } from './tenant.service';
export declare const TenantPrismaProvider: {
    provide: string;
    scope: Scope;
    inject: (typeof TenantService)[];
    useFactory: (tenantService: TenantService) => PrismaClient<import("@prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/client").DefaultArgs> | undefined;
};
