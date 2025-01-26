const debug = require('debug')('app:bin:prod-server');
const app = require('../server/app.js');
const enforce = require('express-sslify');
require('dotenv').config();
if (!process.env.PORT) {
  throw new Error('.env var PORT not defined!');
}
app.use(enforce.HTTPS({ trustProtoHeader: true }));

const server = app.listen(process.env.PORT);

server.on('listening', () => debug(`Server is now running at ${process.env.BASE_URL}${process.env.PREFIX_URL}.`));
