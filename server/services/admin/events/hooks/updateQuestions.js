const _ = require('lodash');

module.exports = () => hook => {
  const eventId = hook.result.id;

  const questionsToAdd = hook.data.questions.map(question => {
    const q = _.merge(question, { eventId });
    if (q.options && Array.isArray(q.options)) q.options = q.options.join(';');
    return q;
  });

  const questionModel = hook.app.get('models').question;
  questionModel.destroy({
    where: { eventId },
  });

  return questionModel
    .bulkCreate(questionsToAdd, {
      updateOnDuplicate: ['question', 'type', 'options', 'required', 'public'],
    })
    .then(() =>
      questionModel.findAll({ where: { eventId } }).then(questions => {
        hook.result.dataValues.questions = questions;
        return hook;
      })
    );
};
