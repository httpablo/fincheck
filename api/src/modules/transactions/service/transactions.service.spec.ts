import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { TransactionRepository } from 'src/shared/database/repositories/transations.repositories';
import { ValidateBankAccountOwnershipService } from '../../bank-accounts/services/validate-bank-account-ownership';
import { ValidateCategoryOwnershipService } from '../../categories/services/validate-category-ownership';
import { ValidateTransactionOwnershipService } from './validate-transaction-ownership';
import { BadRequestException } from '@nestjs/common';
import { TransactionType } from '@prisma/client';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionsRepo: {
    findMany: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
  let validateBankAccountOwnershipService: {
    validate: jest.Mock;
  };
  let validateCategoryOwnershipService: {
    validate: jest.Mock;
  };
  let validateTransactionOwnershipService: {
    validate: jest.Mock;
  };

  beforeEach(async () => {
    transactionsRepo = {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    validateBankAccountOwnershipService = {
      validate: jest.fn().mockResolvedValue({ id: 'acc-1' }),
    };
    validateCategoryOwnershipService = {
      validate: jest.fn(),
    };
    validateTransactionOwnershipService = {
      validate: jest.fn().mockResolvedValue({ id: 'tx-1' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: TransactionRepository, useValue: transactionsRepo },
        {
          provide: ValidateBankAccountOwnershipService,
          useValue: validateBankAccountOwnershipService,
        },
        {
          provide: ValidateCategoryOwnershipService,
          useValue: validateCategoryOwnershipService,
        },
        {
          provide: ValidateTransactionOwnershipService,
          useValue: validateTransactionOwnershipService,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve lançar BadRequestException quando a categoria for de tipo diferente da transação', async () => {
      validateCategoryOwnershipService.validate.mockResolvedValue({
        id: 'cat-1',
        type: TransactionType.EXPENSE,
      });

      await expect(
        service.create('user-1', {
          bankAccountId: 'b3f5b9d2-5555-4444-8888-123456789abc',
          categoryId: 'c4f5b9d2-5555-4444-8888-123456789abc',
          name: 'Salário',
          value: 5000,
          date: '2026-10-23T00:00:00.000Z',
          type: TransactionType.INCOME,
        }),
      ).rejects.toThrow(
        new BadRequestException(
          'Transaction type does not match category type',
        ),
      );

      expect(transactionsRepo.create).not.toHaveBeenCalled();
    });

    it('deve criar a transação com sucesso quando a categoria tiver o mesmo tipo', async () => {
      validateCategoryOwnershipService.validate.mockResolvedValue({
        id: 'cat-1',
        type: TransactionType.INCOME,
      });

      const dto = {
        bankAccountId: 'b3f5b9d2-5555-4444-8888-123456789abc',
        categoryId: 'c4f5b9d2-5555-4444-8888-123456789abc',
        name: 'Salário',
        value: 5000,
        date: '2026-10-23T00:00:00.000Z',
        type: TransactionType.INCOME,
      };

      transactionsRepo.create.mockResolvedValue({ id: 'tx-1', ...dto });

      const result = await service.create('user-1', dto);

      expect(transactionsRepo.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          ...dto,
        },
      });
      expect(result).toEqual({ id: 'tx-1', ...dto });
    });
  });

  describe('findAllByUserId', () => {
    it('deve filtrar transações pelo intervalo de datas do mês especificado e ordenar por data decrescente', async () => {
      const mockResult = [
        {
          id: 'tx-2',
          date: new Date('2026-10-20'),
          name: 'Almoço',
        },
        {
          id: 'tx-1',
          date: new Date('2026-10-05'),
          name: 'Mercado',
        },
      ];
      transactionsRepo.findMany.mockResolvedValue(mockResult);

      const result = await service.findAllByUserId('user-1', {
        month: 9, // Outubro (0-indexed)
        year: 2026,
      });

      expect(transactionsRepo.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
          bankAccountId: undefined,
          type: undefined,
          date: {
            gte: new Date(Date.UTC(2026, 9, 1)),
            lt: new Date(Date.UTC(2026, 10, 1)),
          },
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              icon: true,
            },
          },
        },
        orderBy: {
          date: 'desc',
        },
      });

      expect(result).toEqual(mockResult);
    });

    it('deve incluir filtros opcionais de bankAccountId e type quando fornecidos', async () => {
      transactionsRepo.findMany.mockResolvedValue([]);

      await service.findAllByUserId('user-1', {
        month: 11, // Dezembro
        year: 2026,
        bankAccountId: 'acc-1',
        type: TransactionType.EXPENSE,
      });

      expect(transactionsRepo.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
          bankAccountId: 'acc-1',
          type: TransactionType.EXPENSE,
          date: {
            gte: new Date(Date.UTC(2026, 11, 1)),
            lt: new Date(Date.UTC(2027, 0, 1)),
          },
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              icon: true,
            },
          },
        },
        orderBy: {
          date: 'desc',
        },
      });
    });
  });
});
