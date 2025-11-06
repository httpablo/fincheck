import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from 'src/shared/database/repositories/categories.repositories';

@Injectable()
export class ValidateCategoryOwnershipService {
  constructor(private readonly categoriesRepo: CategoriesRepository) {}

  async validate(userId: string, categorytId: string) {
    const isOwner = await this.categoriesRepo.findFirst({
      where: { id: categorytId, userId },
    });

    if (!isOwner) {
      throw new NotFoundException('Bank account not found');
    }
  }
}
