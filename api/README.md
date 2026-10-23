# Fincheck API

Módulo backend da aplicação Fincheck, desenvolvido com **NestJS 11**, **TypeScript**, **Prisma ORM** e **PostgreSQL**.

Para a documentação completa do projeto, configuração do ambiente e arquitetura, consulte o [README principal](../README.md) e o diretório [docs/](../docs/index.md).

## Requisitos

- Node.js 22.x
- Yarn
- PostgreSQL 15 (ou via `docker compose up -d db` na raiz)

## Comandos Principais

```bash
# Instalar dependências
yarn install

# Configurar variáveis de ambiente
cp .env.example .env

# Executar migrações do banco de dados
yarn migrate:dev

# Executar em modo de desenvolvimento (watch)
yarn start:dev

# Compilar para produção
yarn build

# Executar verificações de lint
yarn lint

# Formatar código
yarn format

# Executar testes unitários
yarn test

# Abrir Prisma Studio
yarn studio
```
