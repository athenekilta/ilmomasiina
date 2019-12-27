const _ = require('lodash');

module.exports = () => hook => {
  const models = hook.app.get('models');
  const sequelize = hook.app.get('sequelize');

  const { quotaId } = hook.result;

  return models.quota.findByPk(quotaId).then(quota => {
    const query = {
      attributes: ['id', 'openQuotaSize', 'signupsPublic'],
      distinct: true,
      where: {
        id: quota.eventId,
      },
      // Include quotas of event and count of signups
      include: [
        {
          model: models.quota,
          attributes: [
            'id',
            'size',
            [
              sequelize.fn('COUNT', sequelize.col('quota->signups.id')),
              'signupsBefore',
            ],
          ],
          include: [
            {
              model: models.signup,
              attributes: [],
              where: {
                createdAt: {
                  $lte: hook.result.createdAt,
                },
              },
            },
          ],
        },
      ],
      group: [sequelize.col('event.id'), sequelize.col('quota.id')],
    };

    return models.event.findOne(query).then(event => {
      const currentQuota = _.find(event.quota, { dataValues: { id: quotaId } })
        .dataValues;
      const positionInQuota = currentQuota.signupsBefore;

      let position = null;
      let status = null;

      if (event.signupsPublic) {
        if (
          positionInQuota <= currentQuota.size ||
          currentQuota.size === null
        ) {
          position = positionInQuota;
          status = 'in-quota';
        } else {
          const quotaOverflows = event.quota.map(q =>
            Math.min(0, q.dataValues.size - q.dataValues.signupsBefore)
          );
          const positionInOpen = Math.max(
            0,
            Number(event.openQuotaSize) -
              _.sum(quotaOverflows) -
              currentQuota.size
          );

          if (
            positionInOpen <= event.openQuotaSize &&
            event.openQuotaSize > 0
          ) {
            position = positionInOpen;
            status = 'in-open';
          } else {
            const positionInQueue = Math.max(
              0,
              positionInOpen - Number(event.openQuotaSize)
            );
            position = positionInQueue;
            status = 'in-queue';
          }
        }
      }

      hook.result = {
        id: hook.result.id, // signup id
        position,
        status,
        quotaId,
        editHash: hook.result.editHash,
        createdAt: hook.result.createdAt,
      };
    });
  });
};
