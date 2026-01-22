FROM node:20-alpine

RUN apk add --no-cache ffmpeg git

ENV TZ=Asia/Jakarta
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app
RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

RUN yarn install

RUN mkdir -p auth_info && chown -R node:node auth_info

COPY . .

RUN chown -R node:node /app

USER node

EXPOSE 3000

CMD ["node", "src/index.js"]