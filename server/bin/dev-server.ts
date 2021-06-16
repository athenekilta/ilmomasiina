import debug from 'debug';
import app from '../app';

const port = process.env.PORT || 3000;
const server = app.listen(port);

const debugLog = debug('app:bin:dev-server');

server.on('listening', () => debugLog(`Server is now running at http://localhost:${port}.`));
