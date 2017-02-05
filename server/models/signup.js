const Sequelize = require('sequelize');
const md5 = require('md5');
const config = require('../../config/ilmomasiina.config');

module.exports = function () {
  const app = this;
  const sequelize = app.get('sequelize');

  const Signup = sequelize.define('signup', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: Sequelize.STRING,
    },
    lastName: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    editToken: {
      type: Sequelize.VIRTUAL,
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

  Signup.beforeBulkUpdate({ individualHooks: true }, (data) => {
    if (data.attributes.editToken !== md5(`${data.where.id}${config.editTokenSalt}`)) {
      throw new Error('Invalid editToken');
    }
  });

  return Signup;
};
