import debug from 'debug';
import app from '../app';

if (!process.env.PORT) {
  throw new Error('.env var PORT not defined!');
}

const server = app.listen(process.env.PORT);

const debugLog = debug('app:bin:prod-server');

server.on('listening', () => debugLog(`Server is now running at ${process.env.BASE_URL}${process.env.PREFIX_URL}.`));
