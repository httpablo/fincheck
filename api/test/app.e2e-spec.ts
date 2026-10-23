import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('Fincheck API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  const generateEmail = (prefix: string) =>
    `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}@example.com`;

  describe('Health', () => {
    it('GET /api/v1/health deve responder status ok', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(200);

      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('Autenticação e Rotas Protegidas', () => {
    it('deve retornar 401 ao acessar rota protegida sem token', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/users/profile')
        .expect(401);

      await request(app.getHttpServer())
        .get('/api/v1/bank-accounts')
        .expect(401);

      await request(app.getHttpServer())
        .get('/api/v1/transactions?month=9&year=2026')
        .expect(401);
    });

    it('deve realizar signup (201) e signin (200) com sucesso', async () => {
      const email = generateEmail('auth_test');
      const password = 'Password@123';

      const signupRes = await request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send({
          name: 'Auth User',
          email,
          password,
        })
        .expect(201);

      expect(signupRes.body).toHaveProperty('accessToken');
      expect(typeof signupRes.body.accessToken).toBe('string');

      const signinRes = await request(app.getHttpServer())
        .post('/api/v1/auth/signin')
        .send({
          email,
          password,
        })
        .expect(200);

      expect(signinRes.body).toHaveProperty('accessToken');
      expect(typeof signinRes.body.accessToken).toBe('string');
    });
  });

  describe('Contas, Transações e Saldo Calculado', () => {
    let tokenUserA: string;
    let bankAccountId: string;
    let incomeCategoryId: string;
    let expenseCategoryId: string;
    let transactionAId: string;

    beforeAll(async () => {
      const emailUserA = generateEmail('usera');
      const signupRes = await request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send({
          name: 'User A',
          email: emailUserA,
          password: 'Password@123',
        })
        .expect(201);

      tokenUserA = signupRes.body.accessToken;

      const catRes = await request(app.getHttpServer())
        .get('/api/v1/categories')
        .set('Authorization', `Bearer ${tokenUserA}`)
        .expect(200);

      const incomeCat = catRes.body.find(
        (cat: { type: string }) => cat.type === 'INCOME',
      );
      const expenseCat = catRes.body.find(
        (cat: { type: string }) => cat.type === 'EXPENSE',
      );

      incomeCategoryId = incomeCat.id;
      expenseCategoryId = expenseCat.id;
    });

    it('deve criar conta bancária e transações', async () => {
      const accountRes = await request(app.getHttpServer())
        .post('/api/v1/bank-accounts')
        .set('Authorization', `Bearer ${tokenUserA}`)
        .send({
          name: 'Conta Principal',
          initialBalance: 1000,
          type: 'CHECKING',
          color: '#2b3674',
        })
        .expect(201);

      expect(accountRes.body).toHaveProperty('id');
      bankAccountId = accountRes.body.id;

      const incomeTxRes = await request(app.getHttpServer())
        .post('/api/v1/transactions')
        .set('Authorization', `Bearer ${tokenUserA}`)
        .send({
          bankAccountId,
          categoryId: incomeCategoryId,
          name: 'Recebimento Freelance',
          value: 500,
          date: '2026-10-10T10:00:00.000Z',
          type: 'INCOME',
        })
        .expect(201);

      expect(incomeTxRes.body).toHaveProperty('id');
      transactionAId = incomeTxRes.body.id;

      const expenseTxRes = await request(app.getHttpServer())
        .post('/api/v1/transactions')
        .set('Authorization', `Bearer ${tokenUserA}`)
        .send({
          bankAccountId,
          categoryId: expenseCategoryId,
          name: 'Compra Mercado',
          value: 200,
          date: '2026-10-12T10:00:00.000Z',
          type: 'EXPENSE',
        })
        .expect(201);

      expect(expenseTxRes.body).toHaveProperty('id');
    });

    it('deve retornar a conta bancária com currentBalance calculado corretamente', async () => {
      const accountsRes = await request(app.getHttpServer())
        .get('/api/v1/bank-accounts')
        .set('Authorization', `Bearer ${tokenUserA}`)
        .expect(200);

      const account = accountsRes.body.find(
        (acc: { id: string }) => acc.id === bankAccountId,
      );

      expect(account).toBeDefined();
      expect(account.initialBalance).toBe(1000);
      // Saldo esperado: 1000 (inicial) + 500 (receita) - 200 (despesa) = 1300
      expect(account.currentBalance).toBe(1300);
    });

    it('deve retornar 400 para filtros inválidos em GET /transactions', async () => {
      // Mês inválido (maior que 11)
      await request(app.getHttpServer())
        .get('/api/v1/transactions?month=15&year=2026')
        .set('Authorization', `Bearer ${tokenUserA}`)
        .expect(400);

      // Mês inválido (menor que 0)
      await request(app.getHttpServer())
        .get('/api/v1/transactions?month=-1&year=2026')
        .set('Authorization', `Bearer ${tokenUserA}`)
        .expect(400);

      // Ano inválido (< 1970)
      await request(app.getHttpServer())
        .get('/api/v1/transactions?month=9&year=1900')
        .set('Authorization', `Bearer ${tokenUserA}`)
        .expect(400);

      // UUID de bankAccountId inválido
      await request(app.getHttpServer())
        .get(
          '/api/v1/transactions?month=9&year=2026&bankAccountId=invalid-uuid',
        )
        .set('Authorization', `Bearer ${tokenUserA}`)
        .expect(400);
    });

    it('deve garantir isolamento: usuário B recebe 404 ao tentar editar transação do usuário A', async () => {
      const emailUserB = generateEmail('userb');
      const signupBRes = await request(app.getHttpServer())
        .post('/api/v1/auth/signup')
        .send({
          name: 'User B',
          email: emailUserB,
          password: 'Password@123',
        })
        .expect(201);

      const tokenUserB = signupBRes.body.accessToken;

      const accountBRes = await request(app.getHttpServer())
        .post('/api/v1/bank-accounts')
        .set('Authorization', `Bearer ${tokenUserB}`)
        .send({
          name: 'Conta User B',
          initialBalance: 500,
          type: 'CHECKING',
          color: '#111111',
        })
        .expect(201);

      const catBRes = await request(app.getHttpServer())
        .get('/api/v1/categories')
        .set('Authorization', `Bearer ${tokenUserB}`)
        .expect(200);

      const catB = catBRes.body.find(
        (c: { type: string }) => c.type === 'EXPENSE',
      );

      // Usuário B tenta atualizar a transação criada pelo usuário A
      await request(app.getHttpServer())
        .put(`/api/v1/transactions/${transactionAId}`)
        .set('Authorization', `Bearer ${tokenUserB}`)
        .send({
          bankAccountId: accountBRes.body.id,
          categoryId: catB.id,
          name: 'Tentativa Invasão',
          value: 999,
          date: '2026-10-15T12:00:00.000Z',
          type: 'EXPENSE',
        })
        .expect(404);
    });
  });
});
