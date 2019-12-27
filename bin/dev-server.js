const debug = require('debug')('app:bin:dev-server');
const project = require('../config/project.config');

const app = require('../server/app.js');

const server = app.listen(project.server_port);

server.on('listening', () =>
  debug(`Server is now running at http://localhost:${project.server_port}.`)
);
