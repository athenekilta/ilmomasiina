module.exports = app => {
  const models = app.get('models');
  const moment = require('moment');

  models.signup
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
      console.log('modelsThatShouldBeDeleted');
      console.log(r);
    });
};
