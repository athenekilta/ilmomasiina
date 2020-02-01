const _ = require('lodash');

module.exports = () => hook => {
  const sequelize = hook.app.get('sequelize');

  const eventId = hook.result.id;
  const quotasToAdd = hook.data.quota.map(quota => _.merge(quota, { eventId }));
  const quotaModel = hook.app.get('models').quota;

  return sequelize
    .transaction(t => {
      return quotaModel
        .destroy(
          {
            where: { eventId }
          },
          { transaction: t }
        )
        .then(() => {
          return quotaModel
            .bulkCreate(
              quotasToAdd,
              {
                updateOnDuplicate: [
                  'id',
                  'title',
                  'size',
                  'order',
                  'creatdAt',
                  'updatedAt',
                  'deletedAt',
                  'eventId'
                ]
              },
              { transaction: t }
            )
            .then(() => {
              return quotaModel.findAll(
                {
                  where: {
                    eventId,
                    deletedAt: null
                  },
                  include: [
                    {
                      attributes: [
                        'firstName',
                        'lastName',
                        'email',
                        'createdAt'
                      ],
                      model: sequelize.models.signup,
                      required: false
                    }
                  ],
                  order: [['order', 'ASC']]
                },
                { transaction: t }
              );
            });
        });
    })
    .then(quota => {
      hook.result.dataValues.quota = quota;
      return hook;
    })
    .catch(error => {
      throw new Error('Quota update failed');
    });
};
