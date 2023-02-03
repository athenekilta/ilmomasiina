const moment = require('moment')
module.exports = () => hook => {
  const sequelize = hook.app.get('sequelize');
  const Op = sequelize.Op
  hook.params.sequelize = {
    attributes: [
      'id',
      'title',
      'date',
      'draft',
      'registrationStartDate',
      'registrationEndDate',
      'openQuotaSize',
      'signupsPublic',
    ],
    order: [
      [{ model: sequelize.models.quota }, 'sortId', 'ASC'],
    ],
    distinct: true,
    raw: false,
    // filter out events older than 1 month
    where: {
      date: {
        [Op.gt]: moment().subtract(30, 'days').toDate()
      }
    },
    // Include quotas of event and count of signups
    include: [
      {
        model: sequelize.models.quota,
        attributes: [
          'title',
          'size',
          'sortId',
          [
            sequelize.fn('COUNT', sequelize.col('quota->signups.id')),
            'signupCount',
          ],
        ],
        include: [
          {
            model: sequelize.models.signup,
            required: false,
            attributes: [],
          },
        ],
      },
    ],
    group: [sequelize.col('event.id'), sequelize.col('quota.id')],
  };
};
