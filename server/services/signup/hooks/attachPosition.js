const _ = require('lodash');

module.exports = () => (hook) => {
  const models = hook.app.get('models');
  const sequelize = hook.app.get('sequelize');

  const quotaId = hook.result.quotaId;

  return models.quota.findById(quotaId)
    .then((quota) => {
      const query = {
        attributes: ['id', 'openQuota'],
        distinct: true,
        where: {
          id: quota.eventId,
        },
        // Include quotas of event and count of signups
        include: [{
          model: models.quota,
          attributes: [
            'id',
            'size',
            [sequelize.fn('COUNT', sequelize.col('quota.signups.id')), 'signupsBefore'],
          ],
          include: [{
            model: models.signup,
            attributes: [],
            where: {
              createdAt: {
                $lte: hook.result.createdAt,
              },
            },
          }],
        }],
        group: [sequelize.col('event.id'), sequelize.col('quota.id')],
      };

      return models.event.findOne(query)
        .then((event) => {
          const currentQuota = _.find(event.quota, { dataValues: { id: quotaId } }).dataValues;
          const positionInQuota = currentQuota.signupsBefore;

          const quotaOverflows = event.quota.map(q => Math.min(0, q.dataValues.size - q.dataValues.signupsBefore));
          const positionInOpen = Math.max(0, Number(event.openQuota) - _.sum(quotaOverflows) - currentQuota.size);

          const positionInQueue = Math.max(0, positionInOpen - Number(event.openQuota));

          hook.result = {
            id: hook.result.id, // signup id
            positionInQuota,
            positionInOpen,
            positionInQueue,
            editHash: hook.result.editHash,
            createdAt: hook.result.createdAt,
          };
        });
    });
};
