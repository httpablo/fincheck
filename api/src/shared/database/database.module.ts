import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserRepository } from './repositories/users.repositories';
import { CategoriesRepository } from './repositories/categories.repositories';
import { BankAccountRepository } from './repositories/bank-account.repositories';

@Global()
@Module({
  providers: [
    PrismaService,
    UserRepository,
    CategoriesRepository,
    BankAccountRepository,
  ],
  exports: [UserRepository, CategoriesRepository, BankAccountRepository],
})
export class DatabaseModule {}
