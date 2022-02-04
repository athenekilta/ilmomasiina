const _ = require('lodash');

module.exports = () => (hook) => {
  const eventId = hook.result.id;
  const sequelize = hook.app.get('sequelize');
  const questionsToAdd = hook.data.questions.map((question) => {
    const q = _.merge(question, { eventId });
    if (q.options && Array.isArray(q.options)) q.options = q.options.join(';');
    return q;
  });

  const questionModel = hook.app.get('models').question;
  return sequelize.transaction(t => {
    return questionModel.destroy({
      where: { eventId }
    }, { transaction: t })
      .then(() => {
        return questionModel.bulkCreate(questionsToAdd, { updateOnDuplicate: true }, { transaction: t })
          .then(() => {
            return questionModel.findAll({ where: { eventId, deletedAt: null } }, { transaction: t })
          });
      });
  })
    .then((questions) => {
      hook.result.dataValues.questions = questions;
      return hook;
    }).catch((error => {
      throw new Error('Question update failed:', error);
    }));

};
