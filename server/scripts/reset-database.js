const debug = require('debug')('app:script');
const feathers = require('@feathersjs/feathers');

const models = require('../server/models');

debug('Resetting database tables...');

const app = feathers();
app.configure(models);

const seq = app.get('sequelize');

seq.sync({ force: true })
  .then(() => seq.close())
  .then(() => debug('Database reset finished.'));

module.exports = app;
