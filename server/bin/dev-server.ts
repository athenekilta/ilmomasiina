import debug from 'debug';
import app from '../app';

const project = require('../../../config/project.config');

const server = app.listen(project.server_port);

const debugLog = debug('app:bin:dev-server');

server.on('listening', () => debugLog(`Server is now running at http://localhost:${project.server_port}.`));
