const debug = require('debug')('app:bin:prod-server');
const app = require('../server/app.js');

if (!process.env.PORT) {
  throw new Error('.env var PORT not defined!');
}

const server = app.listen(process.env.PORT);

server.on('listening', () => debug(`Server is now running at ${process.env.BASE_URL}.`));
