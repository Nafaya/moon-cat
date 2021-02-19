FROM node:14.15.5-alpine as build
WORKDIR /app
COPY . .
RUN npm i
RUN npm run build

FROM node:14.15.5-alpine

WORKDIR /app

COPY --from=build /app/dist /app/dist
COPY package*.json .
RUN npm ci --production

CMD npm start
