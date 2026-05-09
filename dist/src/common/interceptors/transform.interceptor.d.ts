import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class TransformInterceptor implements NestInterceptor {
    intercept<T>(context: ExecutionContext, next: CallHandler<T>): Observable<{
        data: T;
        code: number;
        message: string;
    }>;
}
