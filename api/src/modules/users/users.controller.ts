import { Controller, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  profile(@Req() request: any) {
    console.log({ profileUserId: request.userId });

    return this.usersService.getUserById('userId');
  }
}
