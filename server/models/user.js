const Sequelize = require('sequelize');

// User for local auth admin signup

module.exports = function() {
  const app = this;
  const sequelize = app.get('sequelize');

  const User = sequelize.define(
    'user',
    {
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  );

  return User;
};
