const Sequelize = require('sequelize');

module.exports = function () {
  const app = this;
  const sequelize = app.get('sequelize');

  const Event = sequelize.define('events', {
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
  }, {
    freezeTableName: true,
    classMethods: {
      associate() {
        const models = app.get('models');

        this.hasMany(models.quotas, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false,
          },
        });
      },
    },
  });

  return Event;
};
