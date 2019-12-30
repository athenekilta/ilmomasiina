const { Op } = require('sequelize');
const moment = require('moment');

module.exports = () => hook => {
  const sequelize = hook.app.get('sequelize');

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
      draft: false,
      date: {
        [Op.gt]: moment()
          .subtract(1, 'days')
          .toDate(),
      },
    },
    // Include quotas of event and count of signups
    include: [
      {
        model: sequelize.models.quota,
        attributes: [
          'title',
          'size',
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
