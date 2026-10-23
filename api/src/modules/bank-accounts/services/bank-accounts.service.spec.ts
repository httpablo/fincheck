import { Test, TestingModule } from '@nestjs/testing';
import { BankAccountsService } from './bank-accounts.service';
import { BankAccountRepository } from 'src/shared/database/repositories/bank-accounts.repositories';
import { TransactionRepository } from 'src/shared/database/repositories/transations.repositories';
import { ValidateBankAccountOwnershipService } from './validate-bank-account-ownership';
import { BankAccountType, Prisma, TransactionType } from '@prisma/client';

describe('BankAccountsService', () => {
  let service: BankAccountsService;
  let bankAccountsRepo: {
    findMany: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
  let transactionsRepo: {
    groupByValuesByBankAccountAndType: jest.Mock;
  };
  let validateBankAccountOwnershipService: {
    validate: jest.Mock;
  };

  beforeEach(async () => {
    bankAccountsRepo = {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    transactionsRepo = {
      groupByValuesByBankAccountAndType: jest.fn(),
    };
    validateBankAccountOwnershipService = {
      validate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BankAccountsService,
        { provide: BankAccountRepository, useValue: bankAccountsRepo },
        { provide: TransactionRepository, useValue: transactionsRepo },
        {
          provide: ValidateBankAccountOwnershipService,
          useValue: validateBankAccountOwnershipService,
        },
      ],
    }).compile();

    service = module.get<BankAccountsService>(BankAccountsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllByUserId', () => {
    it('deve calcular o saldo atual (currentBalance) corretamente a partir do groupBy de receitas e despesas', async () => {
      const userId = 'user-123';

      const mockBankAccounts = [
        {
          id: 'acc-1',
          userId,
          name: 'Conta Corrente',
          initialBalance: new Prisma.Decimal(1000),
          type: BankAccountType.CHECKING,
          color: '#ffffff',
        },
        {
          id: 'acc-2',
          userId,
          name: 'Investimentos',
          initialBalance: new Prisma.Decimal(500),
          type: BankAccountType.INVESTMENT,
          color: '#000000',
        },
        {
          id: 'acc-3',
          userId,
          name: 'Dinheiro',
          initialBalance: new Prisma.Decimal(200),
          type: BankAccountType.CASH,
          color: '#123456',
        },
      ];

      const mockTransactionsValues = [
        {
          bankAccountId: 'acc-1',
          type: TransactionType.INCOME,
          _sum: { value: new Prisma.Decimal(600) },
        },
        {
          bankAccountId: 'acc-1',
          type: TransactionType.EXPENSE,
          _sum: { value: new Prisma.Decimal(250) },
        },
        {
          bankAccountId: 'acc-2',
          type: TransactionType.EXPENSE,
          _sum: { value: new Prisma.Decimal(100) },
        },
      ];

      bankAccountsRepo.findMany.mockResolvedValue(mockBankAccounts);
      transactionsRepo.groupByValuesByBankAccountAndType.mockResolvedValue(
        mockTransactionsValues,
      );

      const result = await service.findAllByUserId(userId);

      expect(bankAccountsRepo.findMany).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(
        transactionsRepo.groupByValuesByBankAccountAndType,
      ).toHaveBeenCalledWith(userId);

      expect(result).toEqual([
        {
          ...mockBankAccounts[0],
          currentBalance: new Prisma.Decimal(1350), // 1000 + 600 - 250
        },
        {
          ...mockBankAccounts[1],
          currentBalance: new Prisma.Decimal(400), // 500 - 100
        },
        {
          ...mockBankAccounts[2],
          currentBalance: new Prisma.Decimal(200), // 200 + 0
        },
      ]);
    });

    it('deve calcular saldo com precisão Decimal em cenários que falham com Float (0.1 + 0.2, 1520.20)', async () => {
      const userId = 'user-123';

      const mockBankAccounts = [
        {
          id: 'acc-precision-1',
          userId,
          name: 'Conta Centavos',
          initialBalance: new Prisma.Decimal('0.10'),
          type: BankAccountType.CHECKING,
          color: '#ffffff',
        },
        {
          id: 'acc-precision-2',
          userId,
          name: 'Conta Dízima',
          initialBalance: new Prisma.Decimal('1000.10'),
          type: BankAccountType.CHECKING,
          color: '#ffffff',
        },
      ];

      const mockTransactionsValues = [
        {
          bankAccountId: 'acc-precision-1',
          type: TransactionType.INCOME,
          _sum: { value: new Prisma.Decimal('0.20') },
        },
        {
          bankAccountId: 'acc-precision-2',
          type: TransactionType.INCOME,
          _sum: { value: new Prisma.Decimal('520.10') },
        },
      ];

      bankAccountsRepo.findMany.mockResolvedValue(mockBankAccounts);
      transactionsRepo.groupByValuesByBankAccountAndType.mockResolvedValue(
        mockTransactionsValues,
      );

      const result = await service.findAllByUserId(userId);

      // Em IEEE 754 Float: 0.1 + 0.2 = 0.30000000000000004
      // Com Prisma.Decimal: exatamente 0.30
      expect(result[0].currentBalance).toEqual(new Prisma.Decimal('0.30'));
      expect(result[0].currentBalance.toString()).toBe('0.3');
      expect(result[0].currentBalance.toFixed(2)).toBe('0.30');

      // 1000.10 + 520.10 = 1520.20
      expect(result[1].currentBalance).toEqual(new Prisma.Decimal('1520.20'));
      expect(result[1].currentBalance.toString()).toBe('1520.2');
      expect(result[1].currentBalance.toFixed(2)).toBe('1520.20');
    });
  });
});
