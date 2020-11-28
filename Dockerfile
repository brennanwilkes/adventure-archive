## dockerfile
FROM node:12-alpine as builder

WORKDIR /usr/app

COPY package*.json /usr/app/

RUN npm ci

COPY ./ /usr/app/

RUN npm run build:frontend
RUN npm prune --production

## ================
FROM node:12-alpine as runner

WORKDIR /usr/app
ENV NODE_ENV=production

## Copy the runtime files from builder to the runner
COPY --from=builder "/usr/app/package.json" "/usr/app/package.json"
COPY --from=builder "/usr/app/node_modules/" "/usr/app/node_modules/"
COPY --from=builder "/usr/app/public/" "/usr/app/public/"
COPY --from=builder "/usr/app/src/" "/usr/app/src/"
COPY --from=builder "/usr/app/src/" "/usr/app/config/"

RUN ls -la

EXPOSE 8080

RUN adduser -D appuser
USER appuser

CMD ["npm", "run", "start"]
