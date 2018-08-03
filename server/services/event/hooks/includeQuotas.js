module.exports = () => (hook) => {
  const sequelize = hook.app.get('sequelize');

  hook.params.sequelize = {
    attributes: ['id', 'title', 'startDate', 'endDate', 'openQuotaSize'],
    distinct: true,
    // Include quotas of event and count of signups
    include: [
      {
        model: sequelize.models.quota,
        attributes: [
          'title',
          'size',
          'signupOpens',
          'signupCloses',
          [sequelize.fn('COUNT', sequelize.col('quota.signups.id')), 'signupCount'],
        ],
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
