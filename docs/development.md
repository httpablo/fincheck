# Desenvolvimento

Este documento fornece diretrizes para o desenvolvimento e contribuição para o projeto Fincheck.

## Padrões de Código

Para manter a consistência e a qualidade do código, utilizamos as seguintes ferramentas:

-   **ESLint**: Para análise estática de código e identificação de problemas.
-   **Prettier**: Para formatação automática de código.

### Backend (API)

-   **Configuração do ESLint**: `api/eslint.config.mjs`
-   **Configuração do Prettier**: `api/.prettierrc`

Para verificar e corrigir o código, utilize os seguintes comandos no diretório `api`:

```bash
# Verificar e corrigir erros de lint
npm run lint

# Formatar o código com Prettier
npm run format
```

### Frontend (Web)

-   **Configuração do ESLint**: `web/eslint.config.js`

Para verificar o código no diretório `web`, utilize o seguinte comando:

```bash
# Verificar erros de lint
npm run lint
```

É altamente recomendado configurar seu editor de código para usar o ESLint e o Prettier para obter feedback em tempo real.

## Guia de Contribuição

As contribuições são bem-vindas! Siga os passos abaixo para contribuir com o projeto:

1.  **Faça um Fork do Repositório**: Crie uma cópia do repositório em sua conta do GitHub.
2.  **Crie uma Branch**: Crie uma branch para sua nova feature ou correção de bug.
    ```bash
    git checkout -b minha-nova-feature
    ```
3.  **Desenvolva**: Faça as alterações desejadas, seguindo os padrões de código e adicionando testes quando aplicável.
4.  **Faça o Commit**: Faça o commit de suas alterações com uma mensagem clara e descritiva.
    ```bash
    git commit -m "feat: Adiciona nova feature X"
    ```
5.  **Envie suas Alterações**: Envie suas alterações para o seu fork.
    ```bash
    git push origin minha-nova-feature
    ```
6.  **Abra um Pull Request**: Abra um Pull Request do seu fork para o repositório principal, descrevendo as alterações realizadas.
