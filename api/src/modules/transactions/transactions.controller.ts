import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Query,
  ParseEnumPipe,
} from '@nestjs/common';
import { TransactionsService } from './service/transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ActiveUserId } from 'src/shared/decorators/ActiveUserId';
import { TransactionType } from '@prisma/client';
import { ParseMonthPipe } from 'src/shared/pipes/ParseMonthPipe';
import { ParseYearPipe } from 'src/shared/pipes/ParseYearPipe';
import { EmptyStringToUndefinedPipe } from 'src/shared/pipes/EmptyStringToUndefinedPipe';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(
    @ActiveUserId() userId: string,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionsService.create(userId, createTransactionDto);
  }

  @Get()
  findAll(
    @ActiveUserId() userId: string,
    @Query('month', ParseMonthPipe) month: number,
    @Query('year', ParseYearPipe) year: number,
    @Query(
      'bankAccountId',
      new EmptyStringToUndefinedPipe(),
      new ParseUUIDPipe({ optional: true }),
    )
    bankAccountId?: string,
    @Query(
      'type',
      new EmptyStringToUndefinedPipe(),
      new ParseEnumPipe(TransactionType, { optional: true }),
    )
    type?: TransactionType,
  ) {
    return this.transactionsService.findAllByUserId(userId, {
      month,
      year,
      bankAccountId,
      type,
    });
  }

  @Put(':transactionId')
  update(
    @ActiveUserId() userId: string,
    @Param('transactionId', ParseUUIDPipe) transactionId: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(
      userId,
      transactionId,
      updateTransactionDto,
    );
  }

  @Delete(':transactionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @ActiveUserId() userId: string,
    @Param('transactionId', ParseUUIDPipe) transactionId: string,
  ) {
    return this.transactionsService.remove(userId, transactionId);
  }
}
