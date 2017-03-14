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

  return models.signup.findById(hook.id)
    .catch(() => {
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

        // Check that required question have answers
        if (question.required && _.isNil(answer)) {
          throw new Error(`Missing answer for question ${question.question}`);
        }

        // Check that select and checkbox answers are one of the options
        if ((question.type === 'select' || question.type === 'checkbox') && !_.isNil(answer)) {
          const options = question.options.split(',');

          if (options.indexOf(answer.answer) < 0) {
            throw new Error(`Invalid answer to question ${question.question}`);
          }
        }

        return true;
      });
      return hook;
    });
};
