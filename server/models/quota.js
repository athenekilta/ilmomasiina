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
    classMethods: {
      associate() {
        // const models = app.get('models');
        //
        // this.hasMany(models.books, {
        //   onDelete: 'CASCADE',
        //   foreignKey: {
        //     allowNull: false,
        //   },
        // });
      },
    },
  });

  return Quota;
};
