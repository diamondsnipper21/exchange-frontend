#FROM node:9-alpine
#
#EXPOSE 8080
#
#ARG NODE_ENV
#ENV NODE_ENV $NODE_ENV
#
#RUN mkdir -p /app
#WORKDIR /app
#COPY package.json yarn.lock /app/
#RUN yarn --pure-lockfile
#COPY . /app


# Build stage
FROM node:9.11-alpine as build-stage
RUN apk add --no-cache --virtual .gyp python make g++ git
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN cat /app/.env >> /etc/environment

ARG ENV_CONFIG
ARG NODE_ENV

ENV ENV_CONFIG $ENV_CONFIG
ENV NODE_ENV $NODE_ENV

RUN ENV_CONFIG=$ENV_CONFIG npm run build



# Production stage
FROM nginx:1.15-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
