import {
  IsEnum,
  IsHexColor,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { BankAccountType } from '@prisma/client';

export class CreateBankAccountDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @Min(-9999999999.99)
  @Max(9999999999.99)
  initialBalance!: number;

  @IsNotEmpty()
  @IsEnum(BankAccountType)
  type!: BankAccountType;

  @IsString()
  @IsNotEmpty()
  @IsHexColor()
  color!: string;
}
