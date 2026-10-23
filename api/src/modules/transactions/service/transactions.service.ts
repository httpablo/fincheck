import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { TransactionRepository } from 'src/shared/database/repositories/transations.repositories';
import { ValidateBankAccountOwnershipService } from '../../bank-accounts/services/validate-bank-account-ownership';
import { ValidateCategoryOwnershipService } from '../../categories/services/validate-category-ownership';
import { ValidateTransactionOwnershipService } from './validate-transaction-ownership';
import { TransactionType } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepo: TransactionRepository,
    private readonly validateBankAccountOwnershipService: ValidateBankAccountOwnershipService,
    private readonly validateCategoryOwnershipService: ValidateCategoryOwnershipService,
    private readonly validateTransactionOwnershipService: ValidateTransactionOwnershipService,
  ) {}

  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    const { bankAccountId, categoryId, date, name, type, value } =
      createTransactionDto;

    await this.validateEntityOwnership({
      userId,
      bankAccountId,
      categoryId,
      transactionType: type,
    });

    return this.transactionsRepo.create({
      data: {
        userId,
        bankAccountId,
        categoryId,
        date,
        name,
        type,
        value,
      },
    });
  }

  findAllByUserId(
    userId: string,
    filters: {
      month: number;
      year: number;
      bankAccountId?: string;
      type?: TransactionType;
    },
  ) {
    return this.transactionsRepo.findMany({
      where: {
        userId,
        bankAccountId: filters.bankAccountId,
        type: filters.type,
        date: {
          gte: new Date(Date.UTC(filters.year, filters.month, 1)),
          lt: new Date(Date.UTC(filters.year, filters.month + 1, 1)),
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
  }

  async update(
    userId: string,
    transactionId: string,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    const { bankAccountId, categoryId, date, name, type, value } =
      updateTransactionDto;

    await this.validateEntityOwnership({
      userId,
      bankAccountId,
      categoryId,
      transactionId,
      transactionType: type,
    });

    return this.transactionsRepo.update({
      where: { id: transactionId, userId },
      data: {
        bankAccountId,
        categoryId,
        date,
        name,
        type,
        value,
      },
    });
  }

  async remove(userId: string, transactionId: string) {
    await this.validateEntityOwnership({
      userId,
      transactionId,
    });

    await this.transactionsRepo.delete({
      where: { id: transactionId, userId },
    });
  }

  private async validateEntityOwnership({
    userId,
    bankAccountId,
    categoryId,
    transactionId,
    transactionType,
  }: {
    userId: string;
    bankAccountId?: string;
    categoryId?: string;
    transactionId?: string;
    transactionType?: TransactionType;
  }) {
    const [, category] = await Promise.all([
      bankAccountId &&
        this.validateBankAccountOwnershipService.validate(
          userId,
          bankAccountId,
        ),
      categoryId &&
        this.validateCategoryOwnershipService.validate(userId, categoryId),
      transactionId &&
        this.validateTransactionOwnershipService.validate(
          userId,
          transactionId,
        ),
    ]);

    if (category && transactionType && category.type !== transactionType) {
      throw new BadRequestException(
        'Transaction type does not match category type',
      );
    }
  }
}
