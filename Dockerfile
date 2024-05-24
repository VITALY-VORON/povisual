FROM node:21-alpine

RUN apk update && apk add --update git python3 make g++ curl bash

WORKDIR /app

COPY package*.json ./

# RUN npm install
RUN yarn

# TODO: ? store less files inside the image
COPY . .

# runs during the docker build process

RUN rm -rf node_modules/.cache
RUN rm -rf dist
RUN npx prisma generate
# RUN npx prisma migrate dev

RUN yarn build

# default command when running up a container (overriden in docker-compose)
# CMD npm run build