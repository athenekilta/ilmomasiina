const _ = require('lodash');

module.exports = () => (hook) => {
  const requiredFields = ['firstName', 'lastName', 'email'];

  requiredFields.map((fieldName) => {
    if (_.isNil(hook.data[fieldName])) {
      throw new Error('Empty fields on submit');
    }
    return true;
  });

  hook.data.confirmedAt = new Date();

  const models = hook.app.get('models');

  return models.signup
    .findById(hook.id)
    .catch((error) => {
      throw new Error('Signup expired');
    })
    .then((signup) => {
      if (_.isNil(signup)) {
        throw new Error('Signup expired');
      }

      hook.data.createdAt = signup.createdAt;
      return signup;
    })
    .then(signup => models.quota.findById(signup.quotaId))
    .then(quota => models.event.findById(quota.eventId))
    .then(event => event.getQuestions())
    .then((questions) => {
      // Remove answers to other events questions
      const questionIds = questions.map(q => q.id);
      _.remove(hook.data.answers, obj => questionIds.indexOf(obj.questionId) < 0);

      questions.map((question) => {
        const answer = _.find(hook.data.answers, { questionId: question.id });

        if (_.isNil(answer)) {
          if (question.required) {
            throw new Error(`Missing answer for question ${question.question}`);
          }
        } else {
          // Check that the select answer is valid
          if (question.type === 'select') {
            const options = question.options.split(';');

            if (options.indexOf(answer.answer) === -1) {
              throw new Error(`Invalid answer to question ${question.question}`);
            }
          }
          // Check that all checkbox answers are valid
          if (question.type === 'checkbox') {
            const options = question.options.split(';');
            const answers = answer.answer.split(';');
            _.each(answers, (ans) => {
              if (options.indexOf(ans) === -1) {
                throw new Error(`Invalid answer to question ${question.question}`);
              }
            });
          }
        }

        return true;
      });
      return hook;
    });
};
