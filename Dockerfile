FROM node:8.9.4-alpine
RUN apk update && apk add --no-cache python build-base gcc g++ postgresql-dev
ADD . /opt/ilmomasiina
WORKDIR /opt/ilmomasiina
RUN adduser -D athene
RUN chown -R athene /opt/ilmomasiina
USER athene
RUN npm install
RUN npm run compile
ENTRYPOINT ["npm", "run", "start:prod"]
