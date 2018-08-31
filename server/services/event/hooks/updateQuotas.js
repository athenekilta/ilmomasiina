const _ = require('lodash');

module.exports = () => (hook) => {
  const eventId = hook.result.id;
  const quotasToAdd = hook.data.quota.map(quota => _.merge(quota, { eventId }));

  const quotaModel = hook.app.get('models').quota;

  return quotaModel.bulkCreate(quotasToAdd, { updateOnDuplicate: true })
    .then(() => quotaModel.findAll({ where: { eventId } })
      .then((quota) => {
        hook.result.quota = quota;
        return hook;
      }),
    );
};
