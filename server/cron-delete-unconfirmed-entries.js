const moment = require('moment');

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
      console.log('Unconfirmed signups: ');
      console.log(r);
      console.log(r.map(s => s.dataValues.id));
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
          .then(res => console.log(res))
          .catch(error => console.log(error));
      });
    });
};
