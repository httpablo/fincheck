import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { env } from './shared/config/env';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set('trust proxy', 1);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const defaultProductionOrigins = [
    'https://fincheckhttpablo.app',
    'https://www.fincheckhttpablo.app',
    'https://fincheck-front-git-main-pablos-projects-f46616d9.vercel.app',
  ];

  const localhostOrigins = [
    'http://localhost:8080',
    'http://localhost:5173',
    'http://localhost:3000',
  ];

  const origins = env.corsOrigins
    ? env.corsOrigins
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
    : [
        ...defaultProductionOrigins,
        ...(process.env.NODE_ENV !== 'production' ? localhostOrigins : []),
      ];

  app.enableCors({
    origin: origins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(env.port ?? 3000);
}
bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
