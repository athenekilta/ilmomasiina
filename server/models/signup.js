const Sequelize = require('sequelize');
const md5 = require('md5');
const moment = require('moment');
const config = require('../../config/ilmomasiina.config'); // eslint-disable-line

module.exports = function() {
  const app = this;
  const sequelize = app.get('sequelize');
  const { Op } = Sequelize;

  const Signup = sequelize.define(
    'signup',
    {
      firstName: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true
        }
      },
      lastName: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true
        }
      },
      email: {
        type: Sequelize.STRING,
        validate: {
          isEmail: true
        }
      },
      editToken: {
        type: Sequelize.VIRTUAL
      },
      confirmedAt: {
        type: Sequelize.DATE(3)
      },
      // Added manually createdAt field to support milliseconds
      createdAt: {
        type: Sequelize.DATE(3),
        defaultValue: () => new Date()
      }
    },
    {
      freezeTableName: true,
      paranoid: true,
      defaultScope: {
        where: {
          [Op.or]: {
            // Is confirmed
            confirmedAt: {
              [Op.ne]: null // $means !=
            },
            // Under 30 minutes old
            createdAt: {
              [Op.gt]: moment()
                .subtract(30, 'minutes')
                .toDate()
            }
          }
        }
      }
    }
  );

  // TODO: edit token validation
  // const verifyEditToken = (data) => {
  //   const token = data.attributes ? data.attributes.editToken : data.where.editToken;

  //   if (data.where.editToken) {
  //     delete data.where.editToken;
  //   }

  //   if (token !== md5(`${data.where[Symbol('and')].id}${config.editTokenSalt}`)) {
  //     throw new Error('Invalid editToken');
  //   }
  // };

  // Signup.beforeBulkUpdate({ individualHooks: true }, verifyEditToken);
  // Signup.beforeBulkDestroy({ individualHooks: true }, verifyEditToken);

  return Signup;
};
