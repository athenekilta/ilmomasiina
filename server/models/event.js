const Sequelize = require('sequelize');
const moment = require('moment');

module.exports = function () {
  const app = this;
  const sequelize = app.get('sequelize');

  const Event = sequelize.define('event', {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    date: {
      type: Sequelize.DATE,
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
    facebookLink: {
      type: Sequelize.STRING,
    },
    draft: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    freezeTableName: true,
    paranoid: true,
    defaultScope: {
      where: {
        $and: {
          draft: false,
          date: {
            $or: {
              $eq: null,
              $gt: moment().subtract(7, 'days').format(),
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
  });

  return Event;
};
