const _ = require('lodash');

module.exports = () => (hook) => {
  const sequelize = hook.app.get('sequelize');

  const eventId = hook.result.id;
  const quotasToAdd = hook.data.quota.map(quota => _.merge(quota, { eventId }));

  const quotaModel = hook.app.get('models').quota;

  console.log('TO ADD', quotasToAdd);

  return quotaModel.bulkCreate(quotasToAdd, { updateOnDuplicate: true })
    .then((res) => {
      console.log('RES', res);
      return quotaModel.findAll({
        where: { eventId },
        include: [{
          attributes: ['firstName', 'lastName', 'email', 'createdAt'],
          model: sequelize.models.signup,
        }],
      })
    })
    .then((quota) => {
      console.log('QUOTAS', quota);
      hook.result.dataValues.quota = quota;
      return hook;
    });
};
