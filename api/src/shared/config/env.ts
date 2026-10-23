import { plainToInstance } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  NotEquals,
  validateSync,
} from 'class-validator';

class Env {
  @IsString()
  @IsNotEmpty()
  dburl!: string;

  @IsString()
  @IsNotEmpty()
  @NotEquals('unsecure_jwt_secret')
  jwtSecret!: string;

  @IsOptional()
  @IsNumber()
  port?: number;

  @IsOptional()
  @IsString()
  corsOrigins?: string;
}

export const env: Env = plainToInstance(Env, {
  dburl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT ? Number(process.env.PORT) : undefined,
  corsOrigins: process.env.CORS_ORIGINS,
});

const errors = validateSync(env);

if (errors.length > 0) {
  throw new Error(JSON.stringify(errors, null, 2));
}
