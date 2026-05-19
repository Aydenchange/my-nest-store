import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import * as client from 'prom-client';
import type { Request } from 'express';

type RequestError = {
  status?: number;
  message?: string;
  stack?: string;
};

// 定义 Prometheus 指标
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'HTTP 请求总数',
  labelNames: ['method', 'path', 'status'],
});

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP 请求耗时分布（秒）',
  labelNames: ['method', 'path'],
  buckets: [0.1, 0.3, 0.5, 1, 3], // 耗时桶
});

@Injectable()
export class MonitoringInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HttpTraffic'); // 使用 Nest 统一包裹的 Winston

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const { method, url } = req;
    const startTime = Date.now();
    const tenantId = req.headers['x-tenant-id'];

    return next.handle().pipe(
      // 成功时的处理
      tap(() => {
        const duration = (Date.now() - startTime) / 1000;
        // 1. 记录 Prometheus 指标
        httpRequestsTotal.labels(method, url, '200').inc();
        httpRequestDuration.labels(method, url).observe(duration);

        // 2. 结构化日志记录（如果耗时超过 500ms 记录为警告）
        const logData = {
          method,
          url,
          duration: `${duration}s`,
          tenantId,
        };
        if (duration > 0.5) {
          this.logger.warn(`慢接口警报: ${JSON.stringify(logData)}`);
        } else {
          this.logger.log(`请求成功: ${JSON.stringify(logData)}`);
        }
      }),
      // 失败时的处理
      catchError((err: unknown) => {
        const duration = (Date.now() - startTime) / 1000;
        const requestError = err as RequestError;
        const status = requestError.status ?? 500;

        httpRequestsTotal.labels(method, url, status.toString()).inc();

        // 记录结构化错误日志
        this.logger.error(
          JSON.stringify({
            method,
            url,
            status,
            duration: `${duration}s`,
            message: requestError.message ?? 'Unknown error',
            stack: requestError.stack,
            tenantId,
          }),
        );

        return throwError(() => err);
      }),
    );
  }
}
