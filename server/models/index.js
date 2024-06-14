const Sequelize = require('sequelize');

const event = require('./event');
const quota = require('./quota');
const signup = require('./signup');
const question = require('./question');
const answer = require('./answer');
const user = require('./user');

const config = require('../../config/ilmomasiina.config.js'); // eslint-disable-line

module.exports = function() {
  const app = this;

  let sequelize;
  if (process.env.CLEARDB_DATABASE_URL) {
    sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL, {
      logging: false,
    });
  } else {
    sequelize = new Sequelize(
      config.mysqlDatabase,
      config.mysqlUser,
      config.mysqlPassword,
      {
        host: process.env.MYSQL_HOST || 'localhost', // If ran in Docker, uses db from compose. Else, uses localhost db.
        dialect: 'mysql',
        logging: false,
      },
    );
  }

  if (sequelize) {
    sequelize
      .authenticate()
      .then(() => {
        const cfg = sequelize.connectionManager.config;
        console.log(`Sequelize: Connected to ${cfg.host} as ${cfg.username}.`);
      })
      .catch(err => {
        const cfg = sequelize.connectionManager.config;
        console.log(
          `Sequelize: Error connecting ${cfg.host} as ${cfg.user}: ${err}`,
        );
      });
  }

  app.set('sequelize', sequelize);

  app.configure(event);
  app.configure(quota);
  app.configure(signup);
  app.configure(question);
  app.configure(answer);
  app.configure(user);

  const { models } = sequelize;

  models.event.hasMany(models.quota, {
    foreignKey: 'eventId',
    onDelete: 'CASCADE',
  });

  models.event.hasMany(models.question, {
    foreignKey: 'eventId',
    onDelete: 'CASCADE',
  });

  models.quota.hasMany(models.signup, {
    onDelete: 'CASCADE',
    foreignKey: 'quotaId',
  });

  models.signup.belongsTo(models.quota, {
    foreignKey: 'quotaId',
  });

  models.signup.hasMany(models.answer, {
    foreignKey: 'signupId',
    onDelete: 'CASCADE',
  });

  models.question.hasMany(models.answer, {
    foreignKey: 'questionId',
    onDelete: 'CASCADE',
  });

  app.set('models', models);

  Object.keys(sequelize.models).forEach(modelName => {
    if ('associate' in sequelize.models[modelName]) {
      sequelize.models[modelName].associate();
    }
  });
};
