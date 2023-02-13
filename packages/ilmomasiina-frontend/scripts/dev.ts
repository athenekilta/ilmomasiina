import { build, BuildResult } from 'esbuild';
import { existsSync, readFileSync, statSync } from 'fs';
import { createServer, request } from 'http';
import { pick } from 'lodash';
import * as path from 'path';
import { WebSocketServer } from 'ws';

import configure from './esbuild';

const config = configure('development');

// Frontend (dev-server / proxy)
const HOST = process.env.HOST || '127.0.0.1';
const PORT = 3000;

// Backend
const BACKEND_HOST = process.env.HOST || '127.0.0.1';
const BACKEND_PORT = 3001;

const BUILD_DIR = config.outdir;

if (!BUILD_DIR) {
  console.error('Build directory not specified in esbuild config');
  process.exit(1);
}

// <script type="module"> requires us to return a Content-Type
const CONTENT_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/vnd.microsoft.icon',
  '.txt': 'text/plain',
  '.map': 'application/json',
};

let wsServer: WebSocketServer;
let buildResult: BuildResult | null;

build({
  ...config,
  minify: false,
  inject: [
    path.join(__dirname, 'autoreload.js'),
  ],
  watch: {
    onRebuild(error, result) {
      if (error) {
        wsServer.clients.forEach((client) => {
          client.send(JSON.stringify({ error: true, build: error }));
        });
      } else {
        buildResult = result;
        wsServer.clients.forEach((client) => {
          client.send(JSON.stringify({ reload: true }));
        });
      }
    },
  },
})
  .then((result) => {
    // Construct a simple HTTP-server to serve built files & proxy api request to the backend
    const server = createServer((req, res) => {
      if (req.url && /^\/api\//.test(req.url)) {
        // Forward requests api endpoints to the server
        const proxyReq = request(
          {
            hostname: BACKEND_HOST,
            port: BACKEND_PORT,
            path: req.url,
            method: req.method,
            headers: req.headers,
          },
          (proxyRes) => {
            // Forward the response to the client
            res.writeHead(proxyRes.statusCode!, proxyRes.headers);
            proxyRes.pipe(res, { end: true });
          },
        );

        // Handle errors
        proxyReq.once('error', (err) => {
          console.error('Proxy request failed', err);
          res.writeHead(502);
          res.end('Proxy request failed');
        });

        // Forward the body of the request to the upstream
        req.pipe(proxyReq, { end: true });
      } else {
        // Serve built frontend files, falling back to index.html
        const target = [
          path.join(BUILD_DIR, req.url!),
          path.join('public/', req.url!),
          path.join(BUILD_DIR, '/index.html'),
        ].find((file) => existsSync(file) && !statSync(file).isDirectory());

        if (!target) {
          console.error(`Not Found: ${req.url}`);
          res.writeHead(404);
          res.end();
        } else {
          try {
            // Guess a Content-Type
            const [extension] = target.match(/\.(\w+)$/) || ['.txt'];
            // Send the file contents
            const data = readFileSync(target);
            res.writeHead(200, {
              'Content-Type': CONTENT_TYPES[extension],
            });
            res.end(data);
          } catch (err) {
            console.error(err);
            res.writeHead(500);
            res.end();
          }
        }
      }
    });

    buildResult = result;

    wsServer = new WebSocketServer({
      server,
      path: '/dev-server',
      clientTracking: true,
    });

    server.once('listening', () => {
      console.info(`Listening on http://${HOST}:${PORT}\n`);
    });
    wsServer.on('connection', (client) => {
      client.send(JSON.stringify({ build: pick(buildResult, 'errors', 'warnings') }));
    });

    server.listen(PORT, HOST);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
