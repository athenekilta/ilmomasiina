import { Sequelize } from 'sequelize';

import event, { Event } from './event';
import quota, { Quota } from './quota';
import signup, { Signup } from './signup';
import question, { Question } from './question';
import answer, { Answer } from './answer';
import user, { User } from './user';

import config from '../config/ilmomasiina.config'; // eslint-disable-line
import { IlmoApplication } from '../defs';

export interface IlmoModels {
  user: typeof User;
  event: typeof Event;
  question: typeof Question;
  signup: typeof Signup;
  answer: typeof Answer;
}

export default function (this: IlmoApplication) {
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
      .catch((err) => {
        const cfg = (sequelize.connectionManager as any).config;
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

  Event.hasMany(Question, {
    foreignKey: {
      name: 'eventId',
      allowNull: false,
    },
    onDelete: 'CASCADE',
  });
  Question.belongsTo(Event);

  Event.hasMany(Quota, {
    foreignKey: {
      name: 'eventId',
      allowNull: false,
    },
    onDelete: 'CASCADE',
  });
  Quota.belongsTo(Event);

  Quota.hasMany(Signup, {
    onDelete: 'CASCADE',
    foreignKey: {
      name: 'quotaId',
      allowNull: false,
    },
  });
  Signup.belongsTo(Quota);

  Signup.hasMany(Answer, {
    foreignKey: {
      name: 'signupId',
      allowNull: false,
    },
    onDelete: 'CASCADE',
  });
  Answer.belongsTo(Signup);

  Question.hasMany(Answer, {
    foreignKey: {
      name: 'questionId',
      allowNull: false,
    },
    onDelete: 'CASCADE',
  });
  Answer.belongsTo(Question);
}
