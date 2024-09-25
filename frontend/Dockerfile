FROM node:20-alpine AS stage

LABEL maintainer="Noel Neethan Rego" \
    application="TalkTide - chat Application" \
    node_v="20.X" \
    angular_cli="v18"

WORKDIR /app

COPY ./app/package.json ./

RUN npm install

COPY ./app .

EXPOSE 4200

# RUN npm run build --omit=dev --aot --outputHashing=all

FROM nginx:alpine

COPY --from=stage /app/dist/appname /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /var/cache/nginx/*

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


