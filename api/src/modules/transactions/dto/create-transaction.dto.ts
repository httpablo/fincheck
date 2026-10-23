import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  Max,
} from 'class-validator';
import { TransactionType } from '@prisma/client';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  bankAccountId!: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  categoryId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @IsPositive()
  @Max(9999999999.99)
  value!: number;

  @IsNotEmpty()
  @IsDateString()
  date!: string;

  @IsNotEmpty()
  @IsEnum(TransactionType)
  type!: TransactionType;
}
