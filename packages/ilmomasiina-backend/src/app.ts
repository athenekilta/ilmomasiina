import express, { json, rest, urlencoded } from '@feathersjs/express';
import feathers from '@feathersjs/feathers';
import compress from 'compression';
import historyApiFallback from 'connect-history-api-fallback';
import { NextFunction } from 'express';
import enforce from 'express-sslify';
import cron from 'node-cron';

import config from './config';
import anonymizeOldSignups from './cron/anonymizeOldSignups';
import deleteUnconfirmedSignups from './cron/deleteUnconfirmedSignups';
import removeDeletedData from './cron/removeDeletedData';
import models from './models';
import services from './services';

const app = express(feathers());

app
  .use(compress())
  .use(json())
  .use(urlencoded({ extended: true }))
  .configure(rest())
  .configure(models)
  .configure(services);

// Create tables if not exist
app.get('sequelize').sync();

// Every minute, remove signups that haven't been confirmed fast enough
cron.schedule('* * * * *', deleteUnconfirmedSignups);

// Daily at 8am, anonymize old signups
cron.schedule('0 8 * * *', anonymizeOldSignups);

// Daily at 8am, delete deleted items from the database
cron.schedule('0 8 * * *', removeDeletedData);

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
  if (config.enforceHttps !== 'false') {
    app.use(enforce.HTTPS({
      trustProtoHeader: config.enforceHttps === 'proxy',
      trustAzureHeader: config.enforceHttps === 'azure',
    }));
    if (config.enforceHttps === 'azure') {
      console.info(
        'Enforcing HTTPS connections.\nEnsure your Azure app is set to redirect HTTP to HTTPS.',
      );
    } else {
      console.info(
        'Enforcing HTTPS connections.\nEnsure your load balancer or reverse proxy sets X-Forwarded-Proto.',
      );
    }
  } else {
    console.warn(
      'HTTPS connections are not enforced by Ilmomasiina.\n'
      + 'For security reasons, please set ENFORCE_HTTPS=proxy and configure your load balancer or reverse proxy to '
      + 'forward only HTTPS connections to Ilmomasiina. In Azure, set ENFORCE_HTTPS=azure instead.',
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

export = app;
