const Sequelize = require('sequelize');

module.exports = function() {
  const app = this;
  const sequelize = app.get('sequelize');

  const Answer = sequelize.define(
    'answer',
    {
      answer: {
        type: Sequelize.STRING,
        allowNull: false
      }
    },
    {
      freezeTableName: true,
      paranoid: true,
      classMethods: {
        associate() {
          const models = app.get('models');

          this.belongsTo(models.signup, {
            foreignKey: { unique: 'signup_and_question' }
          });
          this.belongsTo(models.question, {
            foreignKey: { unique: 'signup_and_question' }
          });
        }
      }
    }
  );

  return Answer;
};
