FROM ghcr.io/bitnoize/node:20-bookworm

LABEL org.opencontainers.image.source=https://github.com/bitnoize/ad-test

ARG DEBIAN_FRONTEND=noninteractive

RUN set -eux; \
    # User home
    usermod -d /home/ad-test node; \
    mkdir -m 0750 /home/ad-test; \
    chown node:node /home/ad-test

WORKDIR /usr/src/ad-test

COPY package.json package-lock.json tsconfig.json .

RUN npm install

COPY . .

RUN npm run build

COPY docker-entrypoint/ /lib/entrypoint/

CMD ["npm", "run", "start"]

