import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/shared/database/repositories/users.repositories';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UserRepository) {}

  async getUserById(userId: string) {
    const user = await this.userRepo.findUnique({
      where: { id: userId },
    });

    return {
      name: user.name,
      email: user.email,
    };
  }
}
