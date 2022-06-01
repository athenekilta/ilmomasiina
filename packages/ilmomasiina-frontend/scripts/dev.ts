import { build } from 'esbuild';
import { readFile, readFileSync } from 'fs';
import { createServer, request } from 'http';
import * as path from 'path';

import config from './esbuild';

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

build({
  ...config,
  watch: {
    onRebuild(error) {
      if (error) console.error('watch build failed:', error);
    },
  },
})
  .then(() => {
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
            if (proxyRes.statusCode) {
              res.writeHead(proxyRes.statusCode, proxyRes.headers);
              proxyRes.pipe(res, { end: true });
            } else {
              res.writeHead(500);
              res.write('Internal Server Error');
            }
          },
        );

        // Forward the body of the request to the upstream
        req.pipe(proxyReq, { end: true });
      } else {
        // Serve built frontend files
        readFile(BUILD_DIR + req.url!, (err, data) => {
          if (err) {
            try {
              const file = readFileSync(path.join(BUILD_DIR, 'index.html'));
              res.writeHead(200);
              res.end(file);
            } catch {
              res.writeHead(404);
              console.error(err);
              res.end();
            }

            return;
          }

          res.writeHead(200);
          res.end(data);
        });
      }
    });

    server.once('listening', () => {
      console.info(`Listening on http://${HOST}:${PORT}\n`);
    });

    server.listen(PORT, HOST);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
