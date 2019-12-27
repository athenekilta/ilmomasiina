FROM node:10

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm rebuild node-sass

COPY . .

EXPOSE 3000

CMD ["./wait-for-it.sh", "db:5432", "--", "npm", "run", "start"]