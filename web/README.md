# Fincheck Web

Módulo frontend da aplicação Fincheck, desenvolvido com **React 19**, **TypeScript**, **Vite 7**, **Tailwind CSS 4** e **TanStack Query 5**.

Para a documentação completa do projeto, configuração do ambiente e arquitetura, consulte o [README principal](../README.md) e o diretório [docs/](../docs/index.md).

## Requisitos

- Node.js 22.x
- Yarn

## Comandos Principais

```bash
# Instalar dependências
yarn install

# Configurar variáveis de ambiente (opcional em dev, o Vite utiliza proxy para /api)
cp .env.example .env

# Executar em modo de desenvolvimento (HMR)
yarn dev

# Compilar para produção (tsc + vite build)
yarn build

# Executar verificações de lint
yarn lint

# Visualizar build localmente
yarn preview
```
