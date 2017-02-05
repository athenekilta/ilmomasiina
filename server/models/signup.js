const Sequelize = require('sequelize');
const md5 = require('md5');
const config = require('../../config/ilmomasiina.config');

module.exports = function () {
  const app = this;
  const sequelize = app.get('sequelize');

  const Signup = sequelize.define('signup', {
    firstName: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: true,
      },
    },
    lastName: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: Sequelize.STRING,
      validate: {
        isEmail: true,
      },
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
