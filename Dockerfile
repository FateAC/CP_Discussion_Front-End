FROM node:lts

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

RUN mkdir -p /app
WORKDIR /app

COPY . .

RUN pnpm install

EXPOSE 3000
