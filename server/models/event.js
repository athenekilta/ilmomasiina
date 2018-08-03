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
      startDate: {
        type: Sequelize.DATE,
      },
      endDate: {
        type: Sequelize.DATE,
      },
      registrationStartDate: {
        type: Sequelize.DATE,
      },
      registrationEndDate: {
        type: Sequelize.DATE,
      },
      useOpenQuota: {
        type: Sequelize.BOOLEAN,
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
      homepage: {
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
      answersPublic: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      verificationEmail: {
        type: Sequelize.TEXT,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      defaultScope: {
        startDate: {
          $and: {
            draft: false,
            date: {
              $or: {
                $eq: null,
                $gt: moment()
                  .subtract(7, 'days')
                  .format(),
              },
            },
          },
        },
      },
      classMethods: {
        associate() {
          const models = app.get('models');

          this.hasMany(models.quota, {
            onDelete: 'CASCADE',
          });

          this.hasMany(models.question, {
            onDelete: 'CASCADE',
          });
        },
      },
    }
  );

  return Event;
};
