# API Endpoints

Esta seção documenta os endpoints da API do Fincheck.

Todas as rotas da API são expostas sob o prefixo global `/api/v1`.
Com exceção das rotas públicas (`/api/v1/health` e `/api/v1/auth/*`), todos os endpoints exigem um token JWT enviado no cabeçalho `Authorization`:

```http
Authorization: Bearer <accessToken>
```

---

## Monitoramento (`/api/v1/health`)

- **`GET /api/v1/health`**
  - **Público**: Sim
  - **Descrição**: Endpoint de healthcheck para sondagem de integridade e liveness pelo Docker Compose, orquestradores e monitoramento de nuvem.
  - **Resposta (200 OK)**:
    ```json
    {
      "status": "ok"
    }
    ```

---

## Autenticação (`/api/v1/auth`)

Endpoints públicos para registro e autenticação de usuários.

- **`POST /api/v1/auth/signup`**
  - **Público**: Sim
  - **Descrição**: Registra um novo usuário na plataforma.
  - **Corpo da Requisição**:
    ```json
    {
      "name": "João Silva",
      "email": "joao@example.com",
      "password": "senhaSegura123"
    }
    ```
    - `password`: mínimo de 8 caracteres.
  - **Resposta (201 Created)**:
    ```json
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

- **`POST /api/v1/auth/signin`**
  - **Público**: Sim
  - **Descrição**: Autentica o usuário com e-mail e senha e retorna o token de acesso.
  - **Corpo da Requisição**:
    ```json
    {
      "email": "joao@example.com",
      "password": "senhaSegura123"
    }
    ```
  - **Resposta (200 OK)**:
    ```json
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

---

## Usuários (`/api/v1/users`)

- **`GET /api/v1/users/profile`**
  - **Público**: Não (requer Bearer token)
  - **Descrição**: Retorna as informações do perfil do usuário autenticado.
  - **Resposta (200 OK)**:
    ```json
    {
      "name": "João Silva",
      "email": "joao@example.com"
    }
    ```

---

## Contas Bancárias (`/api/v1/bank-accounts`)

Gerenciamento das contas bancárias do usuário autenticado.

- **`GET /api/v1/bank-accounts`**
  - **Público**: Não
  - **Descrição**: Retorna todas as contas bancárias do usuário, incluindo o saldo corrente (`currentBalance`) calculado dinamicamente com base nas transações registradas.
  - **Resposta (200 OK)**:
    ```json
    [
      {
        "id": "e0b49cb3-2319-455b-bf99-826c71c66270",
        "userId": "d748f3fb-628d-4cb0-a294-0cfdc20c7467",
        "name": "Conta Corrente",
        "initialBalance": 1000.0,
        "type": "CHECKING",
        "color": "#1C0C5B",
        "currentBalance": 1250.0
      }
    ]
    ```

- **`POST /api/v1/bank-accounts`**
  - **Público**: Não
  - **Descrição**: Cadastra uma nova conta bancária para o usuário.
  - **Corpo da Requisição**:
    ```json
    {
      "name": "Reserva de Emergência",
      "initialBalance": 5000.0,
      "type": "INVESTMENT",
      "color": "#087F5B"
    }
    ```
    - `type`: `CHECKING`, `INVESTMENT` ou `CASH`.
    - `color`: código hexadecimal válido (ex.: `#087F5B`).
  - **Resposta (201 Created)**: Objeto da conta criada.

- **`PUT /api/v1/bank-accounts/:bankAccountId`**
  - **Público**: Não
  - **Parâmetros**: `bankAccountId` (UUID na URL)
  - **Descrição**: Atualiza os dados de uma conta bancária pertencente ao usuário.
  - **Corpo da Requisição**: Mesmo formato do `POST /api/v1/bank-accounts`.
  - **Resposta (200 OK)**: Objeto da conta atualizada.

- **`DELETE /api/v1/bank-accounts/:bankAccountId`**
  - **Público**: Não
  - **Parâmetros**: `bankAccountId` (UUID na URL)
  - **Descrição**: Remove a conta bancária especificada.
  - **Resposta**: `204 No Content`

---

## Categorias (`/api/v1/categories`)

- **`GET /api/v1/categories`**
  - **Público**: Não
  - **Descrição**: Retorna todas as categorias disponíveis para o usuário autenticado.
  - **Resposta (200 OK)**:
    ```json
    [
      {
        "id": "31b08c90-4a81-43ee-8ecf-75573aa1e264",
        "userId": "d748f3fb-628d-4cb0-a294-0cfdc20c7467",
        "name": "Alimentação",
        "icon": "food",
        "type": "EXPENSE"
      }
    ]
    ```

---

## Transações (`/api/v1/transactions`)

Gerenciamento das transações de receitas e despesas.

- **`GET /api/v1/transactions`**
  - **Público**: Não
  - **Descrição**: Lista as transações do usuário dentro de um período especificado, com filtros opcionais.
  - **Query Params**:
    - `month` (*obrigatório*, integer 1-12): Mês de referência.
    - `year` (*obrigatório*, integer): Ano de referência.
    - `bankAccountId` (*opcional*, UUID): Filtrar por conta bancária específica.
    - `type` (*opcional*, `INCOME` | `EXPENSE`): Filtrar por tipo de transação.
  - **Resposta (200 OK)**:
    ```json
    [
      {
        "id": "7df46ee2-09bb-49e0-8269-e58f2e20ff36",
        "userId": "d748f3fb-628d-4cb0-a294-0cfdc20c7467",
        "bankAccountId": "e0b49cb3-2319-455b-bf99-826c71c66270",
        "categoryId": "31b08c90-4a81-43ee-8ecf-75573aa1e264",
        "name": "Almoço",
        "value": 45.5,
        "date": "2026-10-23T12:00:00.000Z",
        "type": "EXPENSE",
        "category": {
          "id": "31b08c90-4a81-43ee-8ecf-75573aa1e264",
          "name": "Alimentação",
          "icon": "food"
        }
      }
    ]
    ```

- **`POST /api/v1/transactions`**
  - **Público**: Não
  - **Descrição**: Cria uma nova transação financeira vinculada a uma conta e categoria.
  - **Corpo da Requisição**:
    ```json
    {
      "bankAccountId": "e0b49cb3-2319-455b-bf99-826c71c66270",
      "categoryId": "31b08c90-4a81-43ee-8ecf-75573aa1e264",
      "name": "Salário",
      "value": 4500.0,
      "date": "2026-10-23T00:00:00.000Z",
      "type": "INCOME"
    }
    ```
    - `bankAccountId`: UUID válido de conta bancária de posse do usuário.
    - `categoryId`: UUID válido de categoria de posse do usuário.
    - `value`: número positivo.
    - `date`: string no formato ISO 8601.
    - `type`: `INCOME` ou `EXPENSE`.
  - **Resposta (201 Created)**: Objeto da transação criada.

- **`PUT /api/v1/transactions/:transactionId`**
  - **Público**: Não
  - **Parâmetros**: `transactionId` (UUID na URL)
  - **Descrição**: Atualiza os dados de uma transação pertencente ao usuário.
  - **Corpo da Requisição**: Mesmo formato do `POST /api/v1/transactions`.
  - **Resposta (200 OK)**: Objeto da transação atualizada.

- **`DELETE /api/v1/transactions/:transactionId`**
  - **Público**: Não
  - **Parâmetros**: `transactionId` (UUID na URL)
  - **Descrição**: Remove a transação especificada.
  - **Resposta**: `204 No Content`
