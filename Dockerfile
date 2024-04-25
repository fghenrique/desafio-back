FROM node:18.14-alpine AS base

# Create app directory
WORKDIR /usr/src/app

COPY . ./
RUN yarn install
RUN yarn build

EXPOSE 1337

ENV MODE=production

CMD node --max_old_space_size=450 dist/main.js
