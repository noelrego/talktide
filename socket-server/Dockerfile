FROM node:20-alpine AS stage

LABEL maintainer="Noel Neethan Rego" \
    application="TalkTide - chat Application" \
    service="Web Socket Server" \
    node_v="20.x" \
    nest_cli="10.x"

WORKDIR /app

COPY ./app/package.json ./

RUN npm i && \
    npm update && \
    npm audit fix

COPY ./app .

EXPOSE 8080
