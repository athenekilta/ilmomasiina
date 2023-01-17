import debug from 'debug';
import { exit } from 'process';

import initApp from '../app';
import config from '../config';

const debugLog = debug('app:bin:server');

initApp().then((app) => {
  const port = config.port || 3000;
  const server = app.listen(port);

  const url = config.nodeEnv === 'development'
    ? `http://localhost:${port}`
    : config.baseUrl;

  server.on('listening', () => debugLog(`Server is now running at ${url}.`));
}).catch((err) => {
  console.error('Failed to initialize app', err);
  exit(1);
});
