# API Endpoints

Esta seção documenta os principais endpoints da API do Fincheck. Todos os endpoints que não são públicos requerem um token JWT de autenticação no cabeçalho `Authorization`.

## Autenticação (`/auth`)

Endpoints públicos para registro e login de usuários.

-   **`POST /auth/signup`**
    -   **Descrição:** Registra um novo usuário.
    -   **Corpo da Requisição:**
        ```json
        {
          "name": "string",
          "email": "string",
          "password": "string"
        }
        ```
    -   **Resposta:**
        ```json
        {
          "accessToken": "string"
        }
        ```

-   **`POST /auth/signin`**
    -   **Descrição:** Autentica um usuário e retorna um token de acesso.
    -   **Corpo da Requisição:**
        ```json
        {
          "email": "string",
          "password": "string"
        }
        ```
    -   **Resposta:**
        ```json
        {
          "accessToken": "string"
        }
        ```

## Contas Bancárias (`/bank-accounts`)

Endpoints para gerenciar as contas bancárias do usuário.

-   **`POST /bank-accounts`**
    -   **Descrição:** Cria uma nova conta bancária para o usuário autenticado.
    -   **Corpo da Requisição:**
        ```json
        {
          "name": "string",
          "initialBalance": "number",
          "type": "CHECKING | INVESTMENT | CASH",
          "color": "string"
        }
        ```

-   **`GET /bank-accounts`**
    -   **Descrição:** Retorna todas as contas bancárias do usuário autenticado.

-   **`PUT /bank-accounts/:bankAccountId`**
    -   **Descrição:** Atualiza uma conta bancária específica.
    -   **Parâmetros:** `bankAccountId` (UUID)
    -   **Corpo da Requisição:**
        ```json
        {
          "name": "string",
          "initialBalance": "number",
          "type": "CHECKING | INVESTMENT | CASH",
          "color": "string"
        }
        ```

-   **`DELETE /bank-accounts/:bankAccountId`**
    -   **Descrição:** Remove uma conta bancária específica.
    -   **Parâmetros:** `bankAccountId` (UUID)
    -   **Resposta:** `204 No Content`

## Categorias (`/categories`)

Endpoints para gerenciar as categorias de transações.

-   **`GET /categories`**
    -   **Descrição:** Retorna todas as categorias do usuário autenticado.

## Transações (`/transactions`)

Endpoints para gerenciar as transações financeiras.

-   **`POST /transactions`**
    -   **Descrição:** Cria uma nova transação.
    -   **Corpo da Requisição:**
        ```json
        {
          "bankAccountId": "string (uuid)",
          "categoryId": "string (uuid)",
          "name": "string",
          "value": "number",
          "date": "string (ISO 8601)",
          "type": "INCOME | EXPENSE"
        }
        ```

-   **`GET /transactions`**
    -   **Descrição:** Retorna todas as transações do usuário, com filtros opcionais.
    -   **Query Params:**
        -   `month` (obrigatório): Mês (1-12)
        -   `year` (obrigatório): Ano
        -   `bankAccountId` (opcional): UUID da conta bancária
        -   `type` (opcional): `INCOME` ou `EXPENSE`

-   **`PUT /transactions/:transactionId`**
    -   **Descrição:** Atualiza uma transação específica.
    -   **Parâmetros:** `transactionId` (UUID)
    -   **Corpo da Requisição:** (mesmo do `POST /transactions`)

-   **`DELETE /transactions/:transactionId`**
    -   **Descrição:** Remove uma transação específica.
    -   **Parâmetros:** `transactionId` (UUID)
    -   **Resposta:** `204 No Content`
