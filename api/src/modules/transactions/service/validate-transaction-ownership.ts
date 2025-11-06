import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionRepository } from 'src/shared/database/repositories/transations.repositories';

@Injectable()
export class ValidateTransactionOwnershipService {
  constructor(private readonly transactionRepo: TransactionRepository) {}

  async validate(userId: string, transactiontId: string) {
    const isOwner = await this.transactionRepo.findFirst({
      where: { id: transactiontId, userId },
    });

    if (!isOwner) {
      throw new NotFoundException('Transaction not found');
    }
  }
}
