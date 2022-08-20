import fastifyCompress from '@fastify/compress';
import fastifyCookie from '@fastify/cookie';
import fastifySensible from '@fastify/sensible';
import fastifyStatic from '@fastify/static';
import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import cron from 'node-cron';
import path from 'path';

import { AdminAuthSession } from './authentication/adminSession';
import config from './config';
import anonymizeOldSignups from './cron/anonymizeOldSignups';
import deleteOldAuditLogs from './cron/deleteOldAuditLogs';
import deleteUnconfirmedSignups from './cron/deleteUnconfirmedSignups';
import removeDeletedData from './cron/removeDeletedData';
import enforceHTTPS from './enforceHTTPS';
import setupDatabase from './models';
import setupRoutes from './routes';

export default async function initApp(): Promise<FastifyInstance> {
  await setupDatabase();

  const server = fastify({
    trustProxy: config.isAzure || config.trustProxy, // Get IPs from X-Forwarded-For
    logger: true, // Enable logger
  });

  server.register(fastifyCookie, {
    // secret: 'my-secret', // for cookies signature
    // parseOptions: {}, // options for parsing cookies
  });

  // Register fastify-sensible (https://github.com/fastify/fastify-sensible)
  server.register(fastifySensible);

  // Enforce HTTPS connections in production
  if (config.nodeEnv === 'production') {
    if (config.enforceHttps) {
      server.addHook('onRequest', enforceHTTPS(config));
      console.info(
        'Enforcing HTTPS connections.\n'
        + 'Ensure your load balancer or reverse proxy sets X-Forwarded-Proto (or X-ARR-SSL in Azure).',
      );
    } else {
      console.warn(
        'HTTPS connections are not enforced by Ilmomasiina.\n'
        + 'For security reasons, please set ENFORCE_HTTPS=proxy and configure your load balancer or reverse proxy to '
        + 'forward only HTTPS connections to Ilmomasiina.',
      );
    }
  }

  // Add on-the-fly compression
  server.register(fastifyCompress, {
    onUnsupportedEncoding: (encoding: string, request: FastifyRequest, reply: FastifyReply) => {
      reply.status(406);
      return `Encoding '${encoding}' not supported`;
    },
  });

  server.register(setupRoutes, {
    prefix: '/api',
    adminSession: new AdminAuthSession(config.feathersAuthSecret),
  });

  // Serving frontend files if frontendFilesPath is not null.
  // Ideally these files should be served by a web server and not the app server,
  // but this helps run a low-effort server.
  if (config.frontendFilesPath) {
    console.info(`Serving frontend files from '${config.frontendFilesPath}'`);
    // With fastify-static, historyApiFallback mode works out of the box
    server.register(fastifyStatic, {
      root: path.resolve(config.frontendFilesPath),
      preCompressed: true,
    });
  }

  // Every minute, remove signups that haven't been confirmed fast enough
  cron.schedule('* * * * *', deleteUnconfirmedSignups);

  // Daily at 8am, anonymize old signups
  cron.schedule('0 8 * * *', anonymizeOldSignups);

  // Daily at 8am, delete deleted items from the database
  cron.schedule('0 8 * * *', removeDeletedData);

  // Daily at 8am, delete old audit logs
  cron.schedule('0 8 * * *', deleteOldAuditLogs);

  return server;
}
