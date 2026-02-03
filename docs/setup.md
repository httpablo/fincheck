# Setup

Este guia detalha os passos necessários para configurar e executar o projeto Fincheck em um ambiente de desenvolvimento local.

## Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

-   **Node.js**: `^22.10.7` (ou uma versão compatível)
-   **Yarn**: (Opcional, mas recomendado)
-   **Docker**: Para executar o banco de dados PostgreSQL.
-   **Git**: Para clonar o repositório.

## Instalação

Siga os passos abaixo para configurar o ambiente de desenvolvimento:

### 1. Clonar o Repositório

```bash
git clone https://github.com/SeuUsuario/fincheck.git
cd fincheck
```

### 2. Configurar o Backend (API)

Navegue até o diretório da API e instale as dependências:

```bash
cd api
npm install
# ou
yarn install
```

### 3. Configurar o Frontend (Web)

Navegue até o diretório do frontend e instale as dependências:

```bash
cd web
npm install
# ou
yarn install
```

### 4. Configurar o Banco de Dados com Docker

Para facilitar a configuração, você pode usar o Docker para executar um container com o PostgreSQL.

```bash
docker run --name fincheck-db -e POSTGRES_USER=user -e POSTGRES_PASSWORD=passw@rd -e POSTGRES_DB=mydb -p 5432:5432 -d postgres
```

Este comando irá criar e executar um container PostgreSQL com as credenciais e o nome do banco de dados definidos no arquivo `.env.example`.

### 5. Configurar Variáveis de Ambiente

O projeto utiliza variáveis de ambiente para configurar a conexão com o banco de dados e outras configurações sensíveis.

#### Backend (API)

Crie um arquivo `.env` na raiz do diretório `api` e adicione as seguintes variáveis:

```env
DATABASE_URL="postgresql://user:passw@rd@localhost:5432/mydb"
JWT_SECRET=sua-chave-secreta-aqui
```

-   **`DATABASE_URL`**: A URL de conexão com o banco de dados PostgreSQL.
-   **`JWT_SECRET`**: Uma chave secreta para a geração de tokens JWT.

#### Frontend (Web)

O frontend não requer um arquivo `.env` para a configuração inicial, mas pode ser necessário para consumir a API. Consulte a documentação do Vite para mais detalhes sobre como configurar variáveis de ambiente no frontend.

## Executando a Aplicação

### 1. Executar as Migrations do Banco de Dados

Com o backend configurado e o container do Docker em execução, aplique as migrations para criar as tabelas no banco de dados:

```bash
cd api
npx prisma migrate dev
```

### 2. Iniciar o Backend

```bash
cd api
npm run start:dev
# ou
yarn start:dev
```

O servidor da API estará disponível em `http://localhost:3000`.

### 3. Iniciar o Frontend

```bash
cd web
npm run dev
# ou
yarn dev
```

A aplicação web estará disponível em `http://localhost:5173`.
