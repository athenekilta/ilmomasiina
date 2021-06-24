import express, { json, rest, urlencoded } from '@feathersjs/express';
import feathers from '@feathersjs/feathers';
import compress from 'compression';
import { NextFunction } from 'express';
import enforce from 'express-sslify';
import cron from 'node-cron';

import config from './config';
import anonymizeOldSignups from './cron/anonymizeOldSignups';
import deleteUnconfirmedSignups from './cron/deleteUnconfirmedSignups';
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

// Serve compiled frontend (TODO: implement Webpack dev server)
app.use(express.static('../../dist'));

if (config.nodeEnv === 'development') {
  // Development: log error messages
  app.use((error: any, req: any, res: any, next: NextFunction) => {
    console.error(error);
    next(error);
  });
  app.use(express.errorHandler());
} else {
  // Production: enforce HTTPS
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

app.use(require('connect-history-api-fallback')());

// Serving ~/dist by default. Ideally these files should be served by
// the web server and not the app server, but this helps to demo the
// server in production.
app.use(express.static('dist'));

export = app;
