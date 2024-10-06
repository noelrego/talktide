FROM node:20-alpine AS stage

LABEL maintainer="Noel Neethan Rego" \
    application="TalkTide - chat Application" \
    node_v="20.x" \
    nest_cli="10.x"

WORKDIR /app

COPY ./app/package.json ./

RUN npm i

COPY ./app .

RUN npm run build

FROM node:20-alpine AS prod

ENV TZ=Asia/Kolkata

# Add user group
RUN addgroup -g 1002 -S appuser && adduser -u 1002 -S appuser -G appuser

WORKDIR /app

COPY ./app/package.json ./

RUN npm i --omit=dev

COPY --from=stage /app/dist /app/dist

# Assign ownership
RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 8082

CMD ["node", "./dist/main"]
