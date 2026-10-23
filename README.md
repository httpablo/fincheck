# Fincheck

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/images/logo-light.svg">
    <img src="docs/images/logo-dark.svg" alt="Fincheck" width="300">
  </picture>
</p>

<p align="center"><b>Suas contas, receitas e despesas em um só lugar, mês a mês.</b></p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS">
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
  <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black" alt="Render">
</p>

O Fincheck é um app de finanças pessoais. A pessoa cadastra as contas que usa no dia a dia (conta corrente, investimento, dinheiro), lança cada receita e despesa com uma categoria e acompanha no dashboard quanto tem em cada conta e para onde foi o dinheiro em cada mês.

**Aplicação:** [fincheckhttpablo.app](https://fincheckhttpablo.app)

<p align="center">
  <img src="docs/images/banner.jpg" alt="Telas do Fincheck: dashboard no celular, dashboard no computador e edição de uma despesa" width="100%">
</p>

## Funcionalidades

**Contas**

- Cadastro de contas do tipo corrente, investimento ou dinheiro, cada uma com nome, cor e saldo inicial.
- Saldo atual de cada conta e saldo total no topo do dashboard, com a opção de esconder os valores.

**Transações**

- Lançamento de receitas e despesas com valor, nome, categoria, conta e data.
- Edição e exclusão de qualquer transação direto da lista.
- Navegação entre os meses do ano e filtros por conta, ano e tipo (receitas, despesas ou todas).

**Conta e interface**

- Cadastro e login com e-mail e senha. Cada usuário só enxerga os próprios dados.
- Categorias prontas a partir do cadastro: Salário, Freelance, Casa, Alimentação, Educação, Lazer, Mercado, Roupas, Transporte, Viagem e Outro.
- Layout adaptado ao celular.

<table>
  <tr>
    <td align="center"><img src="docs/images/screens/login.png" width="280" alt="Login"><br><sub>Login</sub></td>
    <td align="center"><img src="docs/images/screens/dashboard.png" width="280" alt="Dashboard"><br><sub>Dashboard</sub></td>
    <td align="center"><img src="docs/images/screens/menu-novo.png" width="280" alt="Menu de criação"><br><sub>Nova despesa, receita ou conta</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/images/screens/editar-transacao.png" width="280" alt="Edição de despesa"><br><sub>Edição de despesa</sub></td>
    <td align="center"><img src="docs/images/screens/filtros.png" width="280" alt="Filtros"><br><sub>Filtros por conta e ano</sub></td>
    <td align="center"><img src="docs/images/screens/editar-conta.png" width="280" alt="Edição de conta"><br><sub>Edição de conta</sub></td>
  </tr>
</table>

## Tecnologias

| Parte | Principais ferramentas |
| --- | --- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, TanStack Query, React Hook Form, Zod, Radix UI, Swiper |
| **API** | Node.js 20, NestJS 11, TypeScript, Prisma 6, class-validator, JWT, bcryptjs |
| **Dados** | PostgreSQL 15 |
| **Infraestrutura** | Docker, Nginx, Vercel, Render, GitHub Actions |

Em produção, o frontend roda na Vercel e a API roda no Render como Web Service Docker, com o banco no Render Postgres, os dois na região de Frankfurt.

## Fluxograma

<p align="center">
  <img src="docs/images/fluxograma.png" alt="Fluxograma do Fincheck: navegador, frontend na Vercel, API e banco no Render, deploy automático e o ciclo de uma requisição autenticada" width="100%">
</p>

O frontend só conversa com a API, sempre pelo prefixo `/api/v1` e com o token no header `Authorization`. A cada push na `main`, a Vercel gera e publica o frontend e o Render monta a imagem Docker da API a partir do `api/Dockerfile` e faz o deploy. Em paralelo, o GitHub Actions roda lint e build da API e do frontend, também em cada pull request. O diagrama foi feito no [Excalidraw](https://excalidraw.com); para editar, abra [`docs/images/fluxograma.excalidraw`](docs/images/fluxograma.excalidraw) no site.

## Decisões importantes

- **O usuário vem sempre do token**, nunca do corpo da requisição. O decorator `@ActiveUserId` lê o `userId` que o guard extraiu do JWT, e toda consulta ao banco filtra por ele.
- **Todas as rotas são privadas por padrão.** O `AuthGuard` é registrado como guard global, e só cadastro e login são marcados com `@IsPublic`.
- **Recurso de outro usuário responde `404`.** Antes de criar, editar ou excluir, a API confere se a conta, a categoria ou a transação pertence a quem fez o pedido, sem revelar que o registro existe.
- **O saldo não é gravado no banco.** O saldo atual de cada conta é calculado na hora, a partir do saldo inicial e das transações. Assim ele nunca fica fora de sincronia, ao custo de ler as transações da conta a cada consulta.
- **A API não sobe com configuração inválida.** As variáveis de ambiente são validadas na inicialização, e um `JWT_SECRET` vazio ou com o valor padrão `unsecure_jwt_secret` derruba o processo.
- **Migrações rodam no deploy.** O container da API executa `prisma migrate deploy` antes de iniciar o servidor, então o banco está sempre na versão do código.

## Modelagem de dados

<p align="center">
  <img src="docs/images/modelagem.png" alt="Modelagem de dados do Fincheck" width="100%">
</p>

Tudo gira em torno do usuário: contas, categorias e transações guardam o `user_id` de quem as criou. Cada transação aponta para uma conta e, opcionalmente, para uma categoria. Ao excluir um usuário ou uma conta, as transações ligadas a eles também são apagadas; se uma categoria deixar de existir, a transação continua, só que sem categoria. O tipo da transação (`INCOME` ou `EXPENSE`) fica gravado nela mesma, o que permite filtrar receitas e despesas sem consultar as categorias.

## Estrutura do projeto

```
fincheck/
├── docker-compose.yml   # ambiente completo: banco, API e frontend
├── .github/workflows/   # lint e build da API e do frontend
├── api/
│   ├── prisma/          # schema e migrações
│   └── src/
│       ├── modules/     # auth, users, bank-accounts, categories, transactions
│       └── shared/      # configuração, decorators, pipes e repositórios do Prisma
└── web/
    └── src/
        ├── app/         # contexto de autenticação, hooks, serviços da API e utilitários
        └── view/        # páginas, modais e componentes
```

## Como rodar localmente

Você precisa de Docker com Docker Compose. Crie um arquivo `.env` na raiz do projeto, ao lado do `docker-compose.yml`:

```env
POSTGRES_USER=fincheck
POSTGRES_PASSWORD=fincheck
POSTGRES_DB=fincheck
JWT_SECRET=troque-por-uma-chave-longa
```

Gere um `JWT_SECRET` com `openssl rand -base64 48`. Depois:

```bash
docker compose up --build
```

O frontend abre em `http://localhost:8080` e a API em `http://localhost:3000/api/v1`. As migrações rodam sozinhas quando o container da API inicia.

### Desenvolvimento

Para editar com recarga automática, suba só o banco no Docker e rode API e frontend com Node.js 20 e Yarn, cada um em um terminal:

```bash
docker compose up -d db

# em api
cp .env.example .env   # DATABASE_URL=postgresql://fincheck:fincheck@localhost:5432/fincheck e JWT_SECRET
yarn install
yarn migrate:dev
yarn start:dev

# em web
cp .env.example .env   # VITE_API_URL=http://localhost:3000/api/v1
yarn install
yarn dev
```

O frontend abre em `http://localhost:5173`. Para ver e editar os dados do banco, use `yarn studio` na pasta `api`.

### Lint

```bash
# em api
yarn lint

# em web
yarn lint
```

O GitHub Actions roda lint e build da API e do frontend a cada push na `main` e em cada pull request. Na API, o `yarn lint` corrige o que der automaticamente; no CI ele só aponta os erros.
