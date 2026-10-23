# Setup

Este guia detalha os passos necessários para configurar e executar o projeto Fincheck em um ambiente de desenvolvimento local.

## Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

-   **Node.js**: `22.x`
-   **Yarn**: Gerenciador de pacotes padrão do projeto
-   **Docker e Docker Compose**: Para executar o banco PostgreSQL e/ou os containers da aplicação
-   **Git**: Para clonar o repositório

## Instalação

Siga os passos abaixo para configurar o ambiente de desenvolvimento:

### 1. Clonar o Repositório

```bash
git clone https://github.com/httpablo/fincheck.git
cd fincheck
```

### 2. Configurar o Banco de Dados com Docker Compose

Antes de iniciar os containers, copie o arquivo de variáveis de ambiente de exemplo na raiz do projeto para criar o seu `.env`:

```bash
cp .env.example .env
```

O `docker-compose.yml` lê as variáveis `POSTGRES_USER`, `POSTGRES_PASSWORD` e `POSTGRES_DB` deste arquivo para configurar o container do banco.

Em seguida, suba o container do PostgreSQL 15 definido no `docker-compose.yml`:

```bash
docker compose up -d db
```

O serviço subirá com as credenciais padrão:
- **Usuário**: `fincheck`
- **Senha**: `fincheck`
- **Banco de dados**: `fincheck`
- **Porta**: `5432`

### 3. Configurar o Backend (API)

Navegue até o diretório da API e instale as dependências com Yarn:

```bash
cd api
yarn install
```

Configure o arquivo `.env` da API a partir do exemplo:

```bash
cp .env.example .env
```

Edite o arquivo `api/.env`:

```env
DATABASE_URL="postgresql://fincheck:fincheck@localhost:5432/fincheck"
JWT_SECRET=troque-por-uma-chave-longa
```

> **Dica**: Você pode gerar um segredo JWT seguro executando `openssl rand -base64 48`.

Aplique as migrations do Prisma no banco de dados:

```bash
yarn migrate:dev
```

### 4. Configurar o Frontend (Web)

Navegue até o diretório do frontend e instale as dependências com Yarn:

```bash
cd web
yarn install
```

Configure o arquivo `.env` do frontend a partir do exemplo:

```bash
cp .env.example .env
```

Edite o arquivo `web/.env`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

> **Nota**: Durante o desenvolvimento local, se `VITE_API_URL` não for informado, o servidor de desenvolvimento do Vite utiliza o proxy configurado em `vite.config.ts`, encaminhando `/api` diretamente para `http://localhost:3000`.

## Executando a Aplicação em Desenvolvimento

Com o banco de dados rodando (`docker compose up -d db`), execute a API e o frontend em terminais separados:

### 1. Iniciar o Backend

```bash
cd api
yarn start:dev
```

O servidor da API estará disponível em `http://localhost:3000` (com rotas sob o prefixo `/api/v1`).

### 2. Iniciar o Frontend

```bash
cd web
yarn dev
```

A aplicação web estará disponível em `http://localhost:5173`.

## Executando o Ambiente Completo via Docker Compose

Para subir toda a infraestrutura (banco PostgreSQL, API NestJS e frontend Nginx) via containers:

1. Certifique-se de que o `.env` na raiz do projeto foi criado a partir do `.env.example`:
   ```bash
   cp .env.example .env
   ```
2. Inicie os containers:
   ```bash
   docker compose up --build
   ```

- **Frontend**: `http://localhost:8080`
- **API**: `http://localhost:3000/api/v1`
- **PostgreSQL**: `localhost:5432`
