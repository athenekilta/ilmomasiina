const moment = require('moment');
const logger = require('./logger');

module.exports = app => {
  const models = app.get('models');

  models.signup
    .unscoped()
    .findAll({
      where: {
        $and: {
          // Is confirmed
          confirmedAt: {
            $eq: null, // $means ==
          },
          // Over 30 minutes old
          createdAt: {
            $lt: moment()
              .subtract(30, 'minutes')
              .toDate(),
          },
        },
      },
    })
    .then(r => {
      if (r.length > 0) {
        logger.info('Unconfirmed signups: ');
        logger.info(r);
      } else {
        logger.info('No unconfirmed signups');
      }

      return r.map(s => s.dataValues.id);
    })
    .then(r => {
      r.map(id => {
        models.signup
          .unscoped()
          .destroy({
            where: {
              id,
            },
          })
          .then(res => logger.info('Deleted unconfirmed signups'))
          .catch(error =>
            logger.error('Error with unconfirmed signups (cron)'),
          );
      });
    });
};
