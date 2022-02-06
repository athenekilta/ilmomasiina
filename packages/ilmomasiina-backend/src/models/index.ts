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

  const {
    clearDbUrl,
    dbDialect, dbHost, dbDatabase, dbUser, dbPassword,
  } = config;

  let sequelize: Sequelize;
  if (clearDbUrl) {
    sequelize = new Sequelize(clearDbUrl, {
      logging: config.debugDbLogging,
    });
  } else {
    sequelize = new Sequelize(
      dbDatabase!,
      dbUser!,
      dbPassword,
      {
        host: dbHost!,
        dialect: dbDialect as Dialect,
        logging: config.debugDbLogging,
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
