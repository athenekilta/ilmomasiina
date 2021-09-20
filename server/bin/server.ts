import debug from 'debug';

import app from '../app';
import config from '../config';

const port = config.port || 3000;
const server = app.listen(port);

const url = config.nodeEnv === 'development'
  ? `http://localhost:${port}`
  : `${config.mailUrlBase}${config.pathPrefix}`;

const debugLog = debug('app:bin:server');
server.on('listening', () => debugLog(`Server is now running at ${url}.`));
