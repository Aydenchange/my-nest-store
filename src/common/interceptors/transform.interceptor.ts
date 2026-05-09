import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept<T>(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<{ data: T; code: number; message: string }> {
    return next.handle().pipe(
      map((data: T) => ({
        data,
        code: 200,
        message: '请求成功',
      })),
    );
  }
}
