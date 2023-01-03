FROM node:16 AS build

WORKDIR /code

COPY package*.json tsconfig.json .

RUN npm i

COPY ./src ./src

RUN npm run build


FROM node:16-slim

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY --from=build /code/dist .

CMD ["node", "."]

EXPOSE 8080