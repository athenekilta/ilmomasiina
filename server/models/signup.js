const Sequelize = require('sequelize');

module.exports = function () {
  const app = this;
  const sequelize = app.get('sequelize');

  const Signup = sequelize.define('signup', {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
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
