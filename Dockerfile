FROM node:21-bullseye

RUN apt-get update && apt-get install -y git python3 make g++ curl bash nodejs npm

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
COPY tsconfig.json ./

RUN rm -rf node_modules
RUN yarn install

RUN yarn prisma generate
RUN yarn prisma migrate dev

RUN yarn build

# Команда по умолчанию
CMD ["yarn", "start"]
