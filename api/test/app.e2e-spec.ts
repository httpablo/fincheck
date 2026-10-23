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
      expect(typeof account.initialBalance).toBe('number');
      // Saldo esperado: 1000 (inicial) + 500 (receita) - 200 (despesa) = 1300
      expect(account.currentBalance).toBe(1300);
      expect(typeof account.currentBalance).toBe('number');
    });

    it('deve criar transações de 0.1 e 0.2 e conferir currentBalance exato e como number no JSON', async () => {
      const accountRes = await request(app.getHttpServer())
        .post('/api/v1/bank-accounts')
        .set('Authorization', `Bearer ${tokenUserA}`)
        .send({
          name: 'Conta Precisão Decimal',
          initialBalance: 0,
          type: 'CHECKING',
          color: '#333333',
        })
        .expect(201);

      expect(typeof accountRes.body.initialBalance).toBe('number');
      expect(accountRes.body.initialBalance).toBe(0);
      const precisionAccountId = accountRes.body.id;

      const tx1Res = await request(app.getHttpServer())
        .post('/api/v1/transactions')
        .set('Authorization', `Bearer ${tokenUserA}`)
        .send({
          bankAccountId: precisionAccountId,
          categoryId: incomeCategoryId,
          name: 'Entrada 0.1',
          value: 0.1,
          date: '2026-10-20T10:00:00.000Z',
          type: 'INCOME',
        })
        .expect(201);

      expect(typeof tx1Res.body.value).toBe('number');
      expect(tx1Res.body.value).toBe(0.1);

      const tx2Res = await request(app.getHttpServer())
        .post('/api/v1/transactions')
        .set('Authorization', `Bearer ${tokenUserA}`)
        .send({
          bankAccountId: precisionAccountId,
          categoryId: incomeCategoryId,
          name: 'Entrada 0.2',
          value: 0.2,
          date: '2026-10-21T10:00:00.000Z',
          type: 'INCOME',
        })
        .expect(201);

      expect(typeof tx2Res.body.value).toBe('number');
      expect(tx2Res.body.value).toBe(0.2);

      const accountsRes = await request(app.getHttpServer())
        .get('/api/v1/bank-accounts')
        .set('Authorization', `Bearer ${tokenUserA}`)
        .expect(200);

      const precisionAccount = accountsRes.body.find(
        (acc: { id: string }) => acc.id === precisionAccountId,
      );

      expect(precisionAccount).toBeDefined();
      expect(precisionAccount.currentBalance).toBe(0.3);
      expect(typeof precisionAccount.currentBalance).toBe('number');
      expect(typeof precisionAccount.initialBalance).toBe('number');

      const txsRes = await request(app.getHttpServer())
        .get(
          `/api/v1/transactions?month=9&year=2026&bankAccountId=${precisionAccountId}`,
        )
        .set('Authorization', `Bearer ${tokenUserA}`)
        .expect(200);

      expect(txsRes.body.length).toBe(2);
      txsRes.body.forEach((tx: { value: unknown }) => {
        expect(typeof tx.value).toBe('number');
      });
    });

    it('deve retornar 400 ao enviar valor com 3 casas decimais ou que excede DECIMAL(12,2)', async () => {
      // 3 casas decimais em POST /transactions
      await request(app.getHttpServer())
        .post('/api/v1/transactions')
        .set('Authorization', `Bearer ${tokenUserA}`)
        .send({
          bankAccountId,
          categoryId: incomeCategoryId,
          name: 'Valor com 3 decimais',
          value: 10.123,
          date: '2026-10-10T10:00:00.000Z',
          type: 'INCOME',
        })
        .expect(400);

      // 3 casas decimais em POST /bank-accounts
      await request(app.getHttpServer())
        .post('/api/v1/bank-accounts')
        .set('Authorization', `Bearer ${tokenUserA}`)
        .send({
          name: 'Conta 3 decimais',
          initialBalance: 100.999,
          type: 'CHECKING',
          color: '#ffffff',
        })
        .expect(400);

      // Valor excedendo DECIMAL(12,2) (>= 10 000 000 000)
      await request(app.getHttpServer())
        .post('/api/v1/transactions')
        .set('Authorization', `Bearer ${tokenUserA}`)
        .send({
          bankAccountId,
          categoryId: incomeCategoryId,
          name: 'Valor muito grande',
          value: 10000000000,
          date: '2026-10-10T10:00:00.000Z',
          type: 'INCOME',
        })
        .expect(400);

      await request(app.getHttpServer())
        .post('/api/v1/bank-accounts')
        .set('Authorization', `Bearer ${tokenUserA}`)
        .send({
          name: 'Saldo muito grande',
          initialBalance: 10000000000,
          type: 'CHECKING',
          color: '#ffffff',
        })
        .expect(400);
    });

    it('deve garantir que initialBalance, value e currentBalance chegam como number no JSON nas respostas', async () => {
      // POST /bank-accounts
      const accRes = await request(app.getHttpServer())
        .post('/api/v1/bank-accounts')
        .set('Authorization', `Bearer ${tokenUserA}`)
        .send({
          name: 'Conta Formato JSON',
          initialBalance: 1520.2,
          type: 'CHECKING',
          color: '#123456',
        })
        .expect(201);

      expect(typeof accRes.body.initialBalance).toBe('number');
      expect(accRes.body.initialBalance).toBe(1520.2);

      // PUT /bank-accounts
      const updateAccRes = await request(app.getHttpServer())
        .put(`/api/v1/bank-accounts/${accRes.body.id}`)
        .set('Authorization', `Bearer ${tokenUserA}`)
        .send({
          name: 'Conta Formato JSON Editada',
          initialBalance: 3250.45,
          type: 'CHECKING',
          color: '#654321',
        })
        .expect(200);

      expect(typeof updateAccRes.body.initialBalance).toBe('number');
      expect(updateAccRes.body.initialBalance).toBe(3250.45);

      // POST /transactions
      const txRes = await request(app.getHttpServer())
        .post('/api/v1/transactions')
        .set('Authorization', `Bearer ${tokenUserA}`)
        .send({
          bankAccountId: accRes.body.id,
          categoryId: incomeCategoryId,
          name: 'Receita Formato JSON',
          value: 250.5,
          date: '2026-10-15T10:00:00.000Z',
          type: 'INCOME',
        })
        .expect(201);

      expect(typeof txRes.body.value).toBe('number');
      expect(txRes.body.value).toBe(250.5);

      // PUT /transactions
      const updateTxRes = await request(app.getHttpServer())
        .put(`/api/v1/transactions/${txRes.body.id}`)
        .set('Authorization', `Bearer ${tokenUserA}`)
        .send({
          bankAccountId: accRes.body.id,
          categoryId: incomeCategoryId,
          name: 'Receita Formato JSON Editada',
          value: 300.75,
          date: '2026-10-15T10:00:00.000Z',
          type: 'INCOME',
        })
        .expect(200);

      expect(typeof updateTxRes.body.value).toBe('number');
      expect(updateTxRes.body.value).toBe(300.75);

      // GET /bank-accounts
      const listAccRes = await request(app.getHttpServer())
        .get('/api/v1/bank-accounts')
        .set('Authorization', `Bearer ${tokenUserA}`)
        .expect(200);

      const foundAcc = listAccRes.body.find(
        (a: { id: string }) => a.id === accRes.body.id,
      );
      expect(typeof foundAcc.initialBalance).toBe('number');
      expect(typeof foundAcc.currentBalance).toBe('number');
      expect(foundAcc.initialBalance).toBe(3250.45);
      expect(foundAcc.currentBalance).toBe(3551.2);

      // GET /transactions
      const listTxRes = await request(app.getHttpServer())
        .get(
          `/api/v1/transactions?month=9&year=2026&bankAccountId=${accRes.body.id}`,
        )
        .set('Authorization', `Bearer ${tokenUserA}`)
        .expect(200);

      expect(listTxRes.body.length).toBe(1);
      expect(typeof listTxRes.body[0].value).toBe('number');
      expect(listTxRes.body[0].value).toBe(300.75);
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
