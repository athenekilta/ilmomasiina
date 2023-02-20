import debug from 'debug';
import { exit } from 'process';

import initApp from '../app';
import config from '../config';

const debugLog = debug('app:bin:server');

initApp().then((server) => {
  const port = config.port || 3000;

  server.listen({ port });

  server.ready().then(() => {
    const url = config.nodeEnv === 'development'
      ? `http://localhost:${port}`
      : config.baseUrl;
    debugLog(`Server is now running at ${url}.`);
  });
}).catch((err) => {
  console.error('Failed to initialize app', err);
  exit(1);
});
