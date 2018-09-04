const Sequelize = require('sequelize');

const event = require('./event');
const quota = require('./quota');
const signup = require('./signup');
const question = require('./question');
const answer = require('./answer');
const user = require('./user');

const config = require('../../config/ilmomasiina.config.js'); // eslint-disable-line
const sequelizeHeroku = require('sequelize-heroku');

module.exports = function () {
  const app = this;

  let sequelize;
  if (process.env.NODE_ENV === 'production') {
    sequelize = sequelizeHeroku.connect(Sequelize);
  } else {
    sequelize = new Sequelize(config.mysqlDatabase, config.mysqlUser, config.mysqlPassword, {
      host: 'localhost',
      dialect: 'mysql',
      logging: false,
    });
  }

  if (sequelize) {
    sequelize
      .authenticate()
      .then(() => {
        const cfg = sequelize.connectionManager.config;
        console.log(`sequelize-heroku: Connected to ${cfg.host} as ${cfg.username}.`);
      })
      .catch((err) => {
        const cfg = sequelize.connectionManager.config;
        console.log(`Sequelize: Error connecting ${cfg.host} as ${cfg.user}: ${err}`);
      });
  }

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
