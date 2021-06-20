import debug from 'debug';

import app from '../app';

if (!process.env.PORT && process.env.NODE_ENV !== 'development') {
  throw new Error('Missing .env variable: PORT');
}

const port = process.env.PORT || 3000;
const server = app.listen(port);

const url = process.env.NODE_ENV === 'development'
  ? `http://localhost:${port}`
  : `${process.env.BASE_URL}${process.env.PREFIX_URL || ''}`;

const debugLog = debug('app:bin:server');
server.on('listening', () => debugLog(`Server is now running at ${url}.`));
