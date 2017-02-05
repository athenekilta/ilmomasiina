const Sequelize = require('sequelize');
const md5 = require('md5');
const moment = require('moment');
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
    confirmedAt: {
      type: Sequelize.DATE(3),
    },
    // Added manually createdAt field to support milliseconds
    createdAt: {
      type: Sequelize.DATE(3),
      defaultValue: () => new Date(),
    },
  }, {
    freezeTableName: true,
    paranoid: true,
    classMethods: {
      associate() {
        const models = app.get('models');

        this.belongsTo(models.quota, { foreignKey: 'quotaId' });

        this.hasMany(models.answer, {
          onDelete: 'CASCADE',
        });
      },
    },
    defaultScope: {
      where: {
        $or: {
          // Is confirmed
          confirmedAt: {
            $ne: null, // != null
          },
          // Under 30 minutes old
          createdAt: {
            $gt: moment().subtract(30, 'minutes').format(),
          },
        },
      },
    },
  });

  const verifyEditToken = (data) => {
    const token = (data.attributes ? data.attributes.editToken : data.where.editToken);

    if (data.where.editToken) {
      delete data.where.editToken;
    }

    if (token !== md5(`${data.where.id}${config.editTokenSalt}`)) {
      throw new Error('Invalid editToken');
    }
  };

  const verifyConfirmation = (data) => {
    const shouldBeConfirmedBefore = moment(data.attributes.createdAt).add(30, 'minutes').toDate().getTime();
    const confirmedAt = moment(data.attributes.confirmedAt).toDate().getTime();

    if (confirmedAt > shouldBeConfirmedBefore) {
      throw new Error('Signup has expired');
    }
  };

  Signup.beforeBulkUpdate({ individualHooks: true }, verifyEditToken);
  Signup.beforeBulkUpdate({ individualHooks: true }, verifyConfirmation);

  Signup.beforeBulkDestroy({ individualHooks: true }, verifyEditToken);

  return Signup;
};
