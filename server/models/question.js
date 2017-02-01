const Sequelize = require('sequelize');

module.exports = function () {
  const app = this;
  const sequelize = app.get('sequelize');

  const Question = sequelize.define('question', {
    question: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    options: {
      type: Sequelize.STRING,
    },
    required: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    public: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    freezeTableName: true,
    classMethods: {
      associate() {
        const models = app.get('models');

        this.belongsTo(models.event, {});

        this.hasMany(models.answer, {
          onDelete: 'CASCADE',
        });
      },
    },
  });

  return Question;
};
