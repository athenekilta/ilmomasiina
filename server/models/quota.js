const Sequelize = require('sequelize');

module.exports = function() {
  const app = this;
  const sequelize = app.get('sequelize');

  const Quota = sequelize.define(
    'quota',
    {
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      size: {
        type: Sequelize.INTEGER,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );

  return Quota;
};
