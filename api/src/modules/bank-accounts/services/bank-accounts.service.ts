import { Injectable } from '@nestjs/common';
import { CreateBankAccountDto } from '../dto/create-bank-account.dto';
import { BankAccountRepository } from 'src/shared/database/repositories/bank-accounts.repositories';
import { TransactionRepository } from 'src/shared/database/repositories/transations.repositories';
import { UpdateBankAccountDto } from '../dto/update-bank-account.dto';
import { ValidateBankAccountOwnershipService } from './validate-bank-account-ownership';

@Injectable()
export class BankAccountsService {
  constructor(
    private readonly bankAccountsRepo: BankAccountRepository,
    private readonly transactionsRepo: TransactionRepository,
    private readonly validateBankAccountOwnershipService: ValidateBankAccountOwnershipService,
  ) {}

  create(userId: string, createBankAccountDto: CreateBankAccountDto) {
    const { color, initialBalance, name, type } = createBankAccountDto;

    return this.bankAccountsRepo.create({
      data: {
        userId,
        color,
        initialBalance,
        name,
        type,
      },
    });
  }

  async findAllByUserId(userId: string) {
    const [bankAccounts, transactionsValues] = await Promise.all([
      this.bankAccountsRepo.findMany({
        where: { userId },
      }),
      this.transactionsRepo.groupByValuesByBankAccountAndType(userId),
    ]);

    return bankAccounts.map((bankAccount) => {
      const totalTransactions = transactionsValues
        .filter((item) => item.bankAccountId === bankAccount.id)
        .reduce(
          (acc, item) =>
            acc +
            (item.type === 'INCOME'
              ? (item._sum.value ?? 0)
              : -(item._sum.value ?? 0)),
          0,
        );

      const currentBalance = bankAccount.initialBalance + totalTransactions;

      return {
        ...bankAccount,
        currentBalance,
      };
    });
  }

  async update(
    userId: string,
    bankAccountId: string,
    updateBankAccountDto: UpdateBankAccountDto,
  ) {
    await this.validateBankAccountOwnershipService.validate(
      userId,
      bankAccountId,
    );

    const { color, initialBalance, name, type } = updateBankAccountDto;

    return this.bankAccountsRepo.update({
      where: { id: bankAccountId, userId },
      data: {
        color,
        initialBalance,
        name,
        type,
      },
    });
  }

  async remove(userId: string, bankAccountId: string) {
    await this.validateBankAccountOwnershipService.validate(
      userId,
      bankAccountId,
    );

    await this.bankAccountsRepo.delete({
      where: { id: bankAccountId, userId },
    });
  }
}
