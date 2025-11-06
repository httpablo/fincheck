import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserRepository } from './repositories/users.repositories';
import { CategoriesRepository } from './repositories/categories.repositories';
import { BankAccountRepository } from './repositories/bank-accounts.repositories';
import { TransactionRepository } from './repositories/transations.repositories';

@Global()
@Module({
  providers: [
    PrismaService,
    UserRepository,
    CategoriesRepository,
    BankAccountRepository,
    TransactionRepository,
  ],
  exports: [
    UserRepository,
    CategoriesRepository,
    BankAccountRepository,
    TransactionRepository,
  ],
})
export class DatabaseModule {}
