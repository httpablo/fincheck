FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN yarn build

FROM node:22-alpine AS runner

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

RUN chown -R node:node /usr/src/app

USER node

RUN npx prisma generate

CMD ["sh", "-c", "npx prisma migrate deploy && exec node dist/main.js"]
