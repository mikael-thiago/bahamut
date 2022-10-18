FROM node:16-alpine3.16 As development

WORKDIR /home/node/dev/bahamut

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --quiet
RUN npm run prisma-generate

COPY .env ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src