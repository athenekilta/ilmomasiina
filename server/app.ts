import feathers from '@feathersjs/feathers';
import express, { rest, json, urlencoded } from '@feathersjs/express';
import compress from 'compression';
import cron from 'node-cron';
import enforce from 'express-sslify';
import models from './models';
import services from './services';
import deleteUnconfirmedSignups from './cron/deleteUnconfirmedSignups';
import anonymizeOldSignups from './cron/anonymizeOldSignups';

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

/*
 * cron script that removes signups that have not been confirmed within 30 minutes
 * runs every minute
 */
cron.schedule('* * * * *', () => {
  deleteUnconfirmedSignups(app);
});

// Anonymize old signups daily at 8am
cron.schedule('0 8 * * *', () => {
  anonymizeOldSignups(app);
});

if (process.env.NODE_ENV === 'development') {
  app.use(express.errorHandler());
}

app.use(require('connect-history-api-fallback')());

// Serving ~/dist by default. Ideally these files should be served by
// the web server and not the app server, but this helps to demo the
// server in production.
app.use(express.static("dist"));

export = app;
