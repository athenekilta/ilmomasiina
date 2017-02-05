const Sequelize = require('sequelize');

module.exports = function () {
  const app = this;
  const sequelize = app.get('sequelize');

  const Quota = sequelize.define('quota', {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    size: {
      type: Sequelize.INTEGER,
    },
    signupOpens: {
      type: Sequelize.DATE,
    },
    signupCloses: {
      type: Sequelize.DATE,
    },
  }, {
    freezeTableName: true,
    paranoid: true,
    classMethods: {
      associate() {
        const models = app.get('models');

        this.belongsTo(models.event, {});

        this.hasMany(models.signup, {
          onDelete: 'CASCADE',
          foreignKey: 'quotaId',
        });
      },
    },
  });

  return Quota;
};
