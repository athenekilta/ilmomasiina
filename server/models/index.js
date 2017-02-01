const Sequelize = require('sequelize');

const event = require('./event');
const quota = require('./quota');
const signup = require('./signup');
const question = require('./question');
const answer = require('./answer');

const config = require('../../config/ilmomasiina.config.js'); // eslint-disable-line

module.exports = function () {
  const app = this;

  const sequelize = new Sequelize(config.mysqlDatabase, config.mysqlUser, config.mysqlPassword, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
  });

  app.set('sequelize', sequelize);

  app.configure(event);
  app.configure(quota);
  app.configure(signup);
  app.configure(question);
  app.configure(answer);

  app.set('models', sequelize.models);

  Object.keys(sequelize.models).forEach((modelName) => {
    if ('associate' in sequelize.models[modelName]) {
      sequelize.models[modelName].associate();
    }
  });
};
