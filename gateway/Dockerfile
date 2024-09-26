FROM node:20-alpine AS stage

LABEL maintainer="Noel Neethan Rego" \
    application="TalkTide - chat Application" \
    node_v="20.X" \
    nest_cli=""

WORKDIR /app

COPY ./app/package.json ./

RUN npm i && \
    npm update && \
    npm audit fix

COPY ./app .

EXPOSE 8080
