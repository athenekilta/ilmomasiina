const Sequelize = require('sequelize');
const moment = require('moment');

module.exports = function () {
  const app = this;
  const sequelize = app.get('sequelize');

  const Event = sequelize.define(
    'event',
    {
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,
      },
      registrationStartDate: {
        type: Sequelize.DATE,
      },
      registrationEndDate: {
        type: Sequelize.DATE,
      },
      openQuotaSize: {
        type: Sequelize.INTEGER,
        validate: {
          min: 0,
        },
        defaultValue: 0,
      },
      description: {
        type: Sequelize.TEXT,
      },
      price: {
        type: Sequelize.STRING,
      },
      location: {
        type: Sequelize.STRING,
      },
      facebookUrl: {
        type: Sequelize.STRING,
      },
      webpageUrl: {
        type: Sequelize.STRING,
      },
      draft: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      signupsPublic: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      verificationEmail: {
        type: Sequelize.TEXT,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      defaultScope: {
        date: {
          $and: {
            draft: false,
            date: {
              $or: {
                $eq: null,
                $gt: moment()
                  .tz('Europe/Helsinki')
                  .subtract(7, 'days')
                  .format(),
              },
            },
          },
        },
      },
    },
  );

  return Event;
};
