import { Dialect, Sequelize } from 'sequelize';

import config from '../config';
import { IlmoApplication } from '../defs';
import answer, { Answer } from './answer';
import event, { Event } from './event';
import question, { Question } from './question';
import quota, { Quota } from './quota';
import signup, { Signup } from './signup';
import user, { User } from './user';

export interface IlmoModels {
  user: typeof User;
  event: typeof Event;
  question: typeof Question;
  signup: typeof Signup;
  answer: typeof Answer;
}

export default function setupDatabase(this: IlmoApplication) {
  const app = this;

  let sequelize: Sequelize;
  if (config.clearDbUrl) {
    sequelize = new Sequelize(config.clearDbUrl, {
      logging: false,
    });
  } else {
    sequelize = new Sequelize(
      config.dbDatabase!,
      config.dbUser!,
      config.dbPassword,
      {
        host: config.dockerCompose ? 'db' : config.dbHost!,
        dialect: config.dbDialect as Dialect,
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
      .catch((err) => {
        const cfg = (sequelize.connectionManager as any).config;
        console.error(`Sequelize: Error connecting ${cfg.host} as ${cfg.username}: ${err}`);
      });
  }

  app.set('sequelize', sequelize);

  app.configure(event);
  app.configure(quota);
  app.configure(signup);
  app.configure(question);
  app.configure(answer);
  app.configure(user);

  Event.hasMany(Question, {
    foreignKey: {
      allowNull: false,
    },
    onDelete: 'CASCADE',
  });
  Question.belongsTo(Event);

  Event.hasMany(Quota, {
    foreignKey: {
      allowNull: false,
    },
    onDelete: 'CASCADE',
  });
  Quota.belongsTo(Event);

  Quota.hasMany(Signup, {
    foreignKey: {
      allowNull: false,
    },
    onDelete: 'CASCADE',
  });
  Signup.belongsTo(Quota);

  Signup.hasMany(Answer, {
    foreignKey: {
      allowNull: false,
    },
    onDelete: 'CASCADE',
  });
  Answer.belongsTo(Signup);

  Question.hasMany(Answer, {
    foreignKey: {
      allowNull: false,
    },
    onDelete: 'CASCADE',
  });
  Answer.belongsTo(Question);
}
