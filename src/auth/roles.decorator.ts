import { SetMetadata } from '@nestjs/common';

// 定义一个自定义装饰器，用来给接口“打标签”
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
