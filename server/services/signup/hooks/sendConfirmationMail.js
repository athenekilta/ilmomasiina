const _ = require('lodash');
const mail = require('../../../mail');

module.exports = () => (hook) => {
  const models = hook.app.get('models');

  const fields = [
    { label: 'Nimi', answer: `${hook.result.firstName} ${hook.result.lastName}` },
    { label: 'Sähköposti', answer: `${hook.result.email}` },
  ];

  const userAnswers = [];

  return models.answer.findAll({ where: { signupId: hook.result.id } })
    .then(answers => answers.map(answer => userAnswers.push(answer.dataValues)))
    .then(() => models.signup.findById(hook.result.id))
    .then(signup => models.quota.findById(signup.quotaId))
    .then((quota) => {
      fields.push({ label: 'Kiintiö', answer: quota.title });

      return models.event.findById(quota.eventId)
        .then((event) => {
          event.getQuestions()
            .then((questions) => {
              questions.map(question => fields.push({
                label: question.question,
                answer: _.find(userAnswers, { questionId: question.id }).answer,
              }));

              return mail.sendSignUpConfirmation(
                hook.result.email,
                event.title,
                event.confirmationMessage,
                'http://ilmomasiina.io/magical-edit-link', // TODO: remove or update
                fields);
            });
        });
    });
};
