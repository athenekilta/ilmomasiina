const Sequelize = require('sequelize');
const event = require('./event');
const quota = require('./quota');

const config = require('../../config/ilmomasiina.config.js');

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

  app.set('models', sequelize.models);

  Object.keys(sequelize.models).forEach((modelName) => {
    if ('associate' in sequelize.models[modelName]) {
      sequelize.models[modelName].associate();
    }
  });
};
