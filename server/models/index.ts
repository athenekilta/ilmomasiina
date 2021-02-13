import { Application } from '@feathersjs/express';
import { Sequelize } from 'sequelize';

import event from './event';
import quota from './quota';
import signup from './signup';
import question from './question';
import answer from './answer';
import user from './user';

import config from '../config/ilmomasiina.config'; // eslint-disable-line

export default function (this: Application) {
  const app = this;

  let sequelize: Sequelize;
  if (process.env.CLEARDB_DATABASE_URL) {
    sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL, {
      logging: false,
    });
  } else {
    sequelize = new Sequelize(
      config.mysqlDatabase!,
      config.mysqlUser!,
      config.mysqlPassword,
      {
        host: config.mysqlHost,
        dialect: 'mysql',
        logging: false,
      },
    );
  }
  if (sequelize) {
    sequelize
      .authenticate()
      .then(() => {
        const cfg = (sequelize.connectionManager as any).config;
        console.log(`Sequelize: Connected to ${cfg.host} as ${cfg.username}.`);
      })
      .catch(err => {
        const cfg = (sequelize.connectionManager as any).config;
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
};
