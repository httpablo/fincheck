import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/shared/database/repositories/users.repositories';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UserRepository) {}
}
