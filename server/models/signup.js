const Sequelize = require('sequelize');

module.exports = function () {
  const app = this;
  const sequelize = app.get('sequelize');

  const Signup = sequelize.define('signup', {
    firstName: {
      type: Sequelize.STRING,
    },
    lastName: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    editHash: {
      type: Sequelize.STRING,
      defaultValue: () => Math.random().toString(36).slice(-16),
    },
    // Added manually createdAt field to support milliseconds
    createdAt: {
      type: Sequelize.DATE(3),
      defaultValue: () => new Date(),
    },
  }, {
    freezeTableName: true,
    classMethods: {
      associate() {
        const models = app.get('models');

        this.belongsTo(models.quota, { foreignKey: 'quotaId' });

        this.hasMany(models.answer, {
          onDelete: 'CASCADE',
        });
      },
    },
  });

  return Signup;
};
