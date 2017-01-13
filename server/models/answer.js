const Sequelize = require('sequelize');

module.exports = function () {
  const app = this;
  const sequelize = app.get('sequelize');

  const Answer = sequelize.define('answer', {
    answer: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    freezeTableName: true,
    classMethods: {
      associate() {
        const models = app.get('models');

        this.belongsTo(models.signup, {});
        this.belongsTo(models.question, {});
      },
    },
  });

  return Answer;
};
