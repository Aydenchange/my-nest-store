import { Injectable, Scope } from '@nestjs/common';

// 关键：声明为 REQUEST 作用域
@Injectable({ scope: Scope.REQUEST })
export class TenantService {
  private tenantId!: string;

  setTenantId(id: string) {
    this.tenantId = id;
  }

  getTenantId() {
    return this.tenantId;
  }
}
