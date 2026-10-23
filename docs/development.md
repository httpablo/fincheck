# Desenvolvimento

Este documento fornece diretrizes para o desenvolvimento e contribuição para o projeto Fincheck.

## Ambiente de Desenvolvimento

- **Node.js**: `22.x`
- **Gerenciador de Pacotes**: `Yarn`

## Padrões de Código e Linters

Para manter a consistência e a qualidade do código, utilizamos as seguintes ferramentas:

-   **ESLint**: Para análise estática de código e identificação de problemas.
-   **Prettier**: Para formatação automática de código.

### Backend (API)

-   **Configuração do ESLint**: `api/eslint.config.mjs`
-   **Configuração do Prettier**: `api/.prettierrc`

Comandos no diretório `api`:

```bash
# Verificar e corrigir erros de lint
yarn lint

# Formatar o código com Prettier
yarn format

# Compilar o projeto
yarn build

# Executar testes unitários
yarn test
```

### Frontend (Web)

-   **Configuração do ESLint**: `web/eslint.config.js`

Comandos no diretório `web`:

```bash
# Verificar erros de lint
yarn lint

# Compilar o projeto (TypeScript check + Vite build)
yarn build
```

Recomenda-se configurar seu editor de código para executar o ESLint e o Prettier automaticamente ao salvar.

## Guia de Contribuição

As contribuições são bem-vindas! Siga os passos abaixo para contribuir com o projeto:

1.  **Faça um Fork do Repositório**: Crie uma cópia do repositório em sua conta do GitHub.
2.  **Crie uma Branch**: Crie uma branch para sua nova feature ou correção de bug.
    ```bash
    git checkout -b minha-nova-feature
    ```
3.  **Desenvolva**: Faça as alterações desejadas, seguindo os padrões de código e adicionando testes quando aplicável.
4.  **Valide**: Execute os comandos de lint e build tanto na `api/` quanto na `web/`.
5.  **Faça o Commit**: Faça o commit de suas alterações com uma mensagem clara e descritiva.
    ```bash
    git commit -m "feat: Adiciona nova feature X"
    ```
6.  **Envie suas Alterações**: Envie suas alterações para o seu fork.
    ```bash
    git push origin minha-nova-feature
    ```
7.  **Abra um Pull Request**: Abra um Pull Request do seu fork para o repositório principal, descrevendo as alterações realizadas.
