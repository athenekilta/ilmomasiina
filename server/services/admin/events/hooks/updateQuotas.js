const _ = require('lodash');

module.exports = () => (hook) => {
  const sequelize = hook.app.get('sequelize');

  const eventId = hook.result.id;
  const quotasToAdd = hook.data.quota.map(quota => _.merge(quota, { eventId }));

  const quotaModel = hook.app.get('models').quota;

  return quotaModel.bulkCreate(quotasToAdd, { updateOnDuplicate: true })
    .then(() => quotaModel.findAll({
      where: { eventId },
      include: [{
        attributes: ['firstName', 'lastName', 'createdAt'],
        model: sequelize.models.signup,
        // ... and answers of signups
        include: [
          {
            attributes: ['questionId', 'answer'],
            model: sequelize.models.answer,
          },
        ],
      }],
    })
    .then((quota) => {
      hook.result.dataValues.quota = quota;
      return hook;
    }));
};
