FROM node:8.9.4-alpine

ADD . /opt/ilmomasiina
WORKDIR /opt/ilmomasiina
RUN adduser -D athene
RUN chown -R athene /opt/ilmomasiina
USER athene
RUN npm install
ENTRYPOINT ["npm", "start"]