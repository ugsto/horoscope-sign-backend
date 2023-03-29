# BUILDER
FROM node:18-alpine AS builder

USER node

COPY --chown=node:node . /app
WORKDIR /app

RUN yarn install --frozen-lockfile && yarn build

# RUNNER
FROM node:18-alpine

USER node
ENV NODE_ENV=production

COPY --chown=node:node --from=builder /app/dist /app/dist
COPY --chown=node:node --from=builder /app/package.json /app/package.json
COPY --chown=node:node --from=builder /app/.env /app/.env
WORKDIR /app

RUN yarn install --frozen-lockfile --production

CMD ["yarn", "start:prod"]
