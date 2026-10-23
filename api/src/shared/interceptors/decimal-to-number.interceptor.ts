import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Prisma } from '@prisma/client';

export function transformDecimals(data: unknown): unknown {
  if (data === null || data === undefined) {
    return data;
  }

  if (Prisma.Decimal.isDecimal(data)) {
    return Number(data.toFixed(2));
  }

  if (Array.isArray(data)) {
    return data.map((item) => transformDecimals(item));
  }

  if (data instanceof Date) {
    return data;
  }

  if (typeof data === 'object') {
    const transformed: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      transformed[key] = transformDecimals(value);
    }
    return transformed;
  }

  return data;
}

@Injectable()
export class DecimalToNumberInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(map((data) => transformDecimals(data)));
  }
}
