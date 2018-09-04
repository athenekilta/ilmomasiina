const debug = require('debug')('app:script');
const feathers = require('feathers');
const models = require('../server/models')

debug('Creating new user');

const app = feathers();
app.configure(models);

const seq = app.get('sequelize');

seq.models.user.create({ email: 'villevuor@gmail.com', password: 'asd123' })
  .then(() => seq.close())
  .then(() => debug('Database reset finished.'));

module.exports = app;
