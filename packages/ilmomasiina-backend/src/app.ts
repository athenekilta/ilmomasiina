import express, { json, rest, urlencoded } from '@feathersjs/express';
import feathers from '@feathersjs/feathers';
import compress from 'compression';
import historyApiFallback from 'connect-history-api-fallback';
import cors from 'cors';
import { NextFunction, Request, Response } from 'express';
import enforce from 'express-sslify';
import cron from 'node-cron';

import config from './config';
import anonymizeOldSignups from './cron/anonymizeOldSignups';
import deleteOldAuditLogs from './cron/deleteOldAuditLogs';
import deleteUnconfirmedSignups from './cron/deleteUnconfirmedSignups';
import removeDeletedData from './cron/removeDeletedData';
import setupDatabase from './models';
import services from './services';
import { remoteIp } from './util/auditLog';

// Format iCalendar requests
function formatResponse(req: Request, res: Response, next: NextFunction) {
  if (res.data === undefined) {
    next();
    return;
  }

  if (req.path === '/api/ical') {
    res.set('Content-Type', 'text/calendar');
    res.send(res.data);
    return;
  }

  res.set('Content-Type', 'application/json');
  res.json(res.data);
}

const corsOrigins = config.allowOrigin === '*' ? '*' : (config.allowOrigin?.split(',') ?? []);

export default async function initApp() {
  await setupDatabase();

  const app = express(feathers());

  // Get IPs from X-Forwarded-For
  if (config.isAzure || config.trustProxy) {
    app.set('trust proxy', true);
  }

  app
    .use(compress())
    .use(json())
    .use('/api', cors({
      origin: corsOrigins,
    }))
    .use(urlencoded({ extended: true }))
    .use(remoteIp)
    .configure(rest(formatResponse))
    .configure(services);

  if (config.nodeEnv !== 'production') {
    // Development: log error messages
    app.use((error: any, req: any, res: any, next: NextFunction) => {
      console.error(error);
      next(error);
    });
  }

  // Always convert errors to JSON
  app.use(express.errorHandler());

  // Enforce HTTPS connections in production
  if (config.nodeEnv === 'production') {
    if (config.enforceHttps) {
      app.use(enforce.HTTPS({ trustProtoHeader: true }));
      console.info(
        'Enforcing HTTPS connections.\nEnsure your load balancer or reverse proxy sets X-Forwarded-Proto.',
      );
    } else if (!config.isAzure) {
      console.warn(
        'HTTPS connections are not enforced by Ilmomasiina.\n'
        + 'For security reasons, please set ENFORCE_HTTPS=proxy and configure your load balancer or reverse proxy to '
        + 'forward only HTTPS connections to Ilmomasiina.',
      );
    }
  }

  app.use(historyApiFallback());

  // Serving frontend files if frontendFilesPath is not null.
  // Ideally these files should be served by a web server and not the app server,
  // but this helps run a low-effort server.
  if (config.frontendFilesPath) {
    console.info(`Serving frontend files from '${config.frontendFilesPath}'`);
    app.use(express.static(config.frontendFilesPath));
  }

  // Every minute, remove signups that haven't been confirmed fast enough
  cron.schedule('* * * * *', deleteUnconfirmedSignups);

  // Daily at 8am, anonymize old signups
  cron.schedule('0 8 * * *', anonymizeOldSignups);

  // Daily at 8am, delete deleted items from the database
  cron.schedule('0 8 * * *', removeDeletedData);

  // Daily at 8am, delete old audit logs
  cron.schedule('0 8 * * *', deleteOldAuditLogs);

  return app;
}
