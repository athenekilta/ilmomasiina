const moment = require('moment')
module.exports = () => hook => {
  const sequelize = hook.app.get('sequelize');

  const Op = sequelize.Op
  hook.params.sequelize = {
    attributes: [
      'id',
      'title',
      'date',
      'registrationStartDate',
      'registrationEndDate',
      'openQuotaSize',
      'signupsPublic',
    ],
    distinct: true,
    raw: false,
    // Filter out events that are saved as draft
    where: {
      draft: 0,
      date: {
        [Op.gt]: moment().subtract(1, 'days').toDate()
      }
    },
    order: [
      [{ model: sequelize.models.quota }, 'sortId', 'ASC'],
    ],
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
