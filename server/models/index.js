const Sequelize = require('sequelize');

const event = require('./event');
const quota = require('./quota');
const signup = require('./signup');
const question = require('./question');
const answer = require('./answer');
const user = require('./user');

const config = require('../../config/ilmomasiina.config.js'); // eslint-disable-line

module.exports = function () {
  const app = this;

  const sequelize = new Sequelize(
    process.env.DB_DATABASE || 'ilmomasiina',
    process.env.DB_USERNAME || 'ilmomasiina',
    process.env.DB_PASSWORD || '',
    {
      dialect: 'postgres',
      host: process.env.DB_HOSTNAME || 'db',
      port: process.env.DB_PORT || '5432',
      logging: false,
    }
  );

  app.set('sequelize', sequelize);

  app.configure(event);
  app.configure(quota);
  app.configure(signup);
  app.configure(question);
  app.configure(answer);
  app.configure(user);

  app.set('models', sequelize.models);

  Object.keys(sequelize.models).forEach((modelName) => {
    if ('associate' in sequelize.models[modelName]) {
      sequelize.models[modelName].associate();
    }
  });
};
