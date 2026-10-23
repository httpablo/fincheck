import { of } from 'rxjs';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  DecimalToNumberInterceptor,
  transformDecimals,
} from './decimal-to-number.interceptor';

describe('DecimalToNumberInterceptor', () => {
  let interceptor: DecimalToNumberInterceptor;

  beforeEach(() => {
    interceptor = new DecimalToNumberInterceptor();
  });

  describe('transformDecimals', () => {
    it('deve retornar null e undefined inalterados', () => {
      expect(transformDecimals(null)).toBeNull();
      expect(transformDecimals(undefined)).toBeUndefined();
    });

    it('deve converter instâncias de Prisma.Decimal para number com 2 casas', () => {
      const dec1 = new Prisma.Decimal('1520.20');
      const dec2 = new Prisma.Decimal('0.30000000000000004');
      const dec3 = new Prisma.Decimal('100.555');

      expect(transformDecimals(dec1)).toBe(1520.2);
      expect(typeof transformDecimals(dec1)).toBe('number');
      expect(transformDecimals(dec2)).toBe(0.3);
      expect(transformDecimals(dec3)).toBe(100.56);
    });

    it('deve preservar datas e tipos primitivos normais', () => {
      const date = new Date('2026-10-23T12:00:00Z');
      expect(transformDecimals(date)).toBe(date);
      expect(transformDecimals('texto')).toBe('texto');
      expect(transformDecimals(123)).toBe(123);
      expect(transformDecimals(true)).toBe(true);
    });

    it('deve percorrer arrays e objetos recursivamente', () => {
      const input = {
        id: 'acc-1',
        initialBalance: new Prisma.Decimal('1000.50'),
        currentBalance: new Prisma.Decimal('1350.75'),
        createdAt: new Date('2026-10-23T12:00:00Z'),
        transactions: [
          {
            id: 'tx-1',
            value: new Prisma.Decimal('350.25'),
          },
        ],
      };

      const result = transformDecimals(input) as typeof input & {
        initialBalance: number;
        currentBalance: number;
        transactions: Array<{ id: string; value: number }>;
      };

      expect(result.initialBalance).toBe(1000.5);
      expect(result.currentBalance).toBe(1350.75);
      expect(result.transactions[0].value).toBe(350.25);
      expect(result.createdAt).toBe(input.createdAt);
    });
  });

  describe('intercept', () => {
    it('deve interceptar a resposta e transformar decimais para números', (done) => {
      const mockExecutionContext = {} as ExecutionContext;
      const mockCallHandler: CallHandler = {
        handle: () =>
          of({
            initialBalance: new Prisma.Decimal('500.00'),
          }),
      };

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (value) => {
          expect(value).toEqual({
            initialBalance: 500,
          });
          const res = value as { initialBalance: number };
          expect(typeof res.initialBalance).toBe('number');
          done();
        },
        error: (err) => done(err),
      });
    });
  });
});
