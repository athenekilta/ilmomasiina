module.exports = () => (hook) => {
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
    // Include quotas of event and count of signups
    include: [
      {
        model: sequelize.models.quota,
        attributes: ['title', 'size', [sequelize.fn('COUNT', sequelize.col('quota.signups.id')), 'signupCount']],
        include: [
          {
            model: sequelize.models.signup,
            attributes: [],
          },
        ],
      },
    ],
    group: [sequelize.col('event.id'), sequelize.col('quota.id')],
  };
};
