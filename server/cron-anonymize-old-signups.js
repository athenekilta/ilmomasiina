const moment = require('moment');

const redactionKey = 'Deleted';

module.exports = (app) => {
  const models = app.get('models');
  const sequelize = app.get('sequelize');

  models.signup
    .findAll({
      where: {
        $and: {
          $or: {
              firstName: {
                [sequelize.Op.ne]: redactionKey,
            },
            lastName: {
              [sequelize.Op.ne]: redactionKey,
            },
            email: {
              [sequelize.Op.not]: null,
            },
          },
          createdAt: {
            $lt: moment()
              .subtract(6, 'months')
              .toDate(),
          },
        },
        // Over 6 months old

      },
    })
    .then((signups) => {
      if (signups.length !== 0) {
        console.log('Redacting older signups: ');
        console.log(signups.map(s => s.dataValues.id));
        signups.forEach((signup) => {
          signup.updateAttributes({ firstName: redactionKey, lastName: redactionKey, email: null });
        });
      }

    });
};
