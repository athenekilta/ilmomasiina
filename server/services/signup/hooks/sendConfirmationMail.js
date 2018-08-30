const _ = require('lodash');
const EmailService = require('../../../mail/');

module.exports = () => (hook) => {
  const models = hook.app.get('models');

  const fields = [
    { label: 'Nimi', answer: `${hook.result.firstName} ${hook.result.lastName}` },
    { label: 'Sähköposti', answer: `${hook.result.email}` },
  ];

  const userAnswers = [];

  return models.answer
    .findAll({ where: { signupId: hook.result.id } })
    .then(answers => answers.map(answer => userAnswers.push(answer.dataValues)))
    .then(() => models.signup.findById(hook.result.id))
    .then(signup => models.quota.findById(signup.quotaId))
    .then((quota) => {
      fields.push({ label: 'Kiintiö', answer: quota.title });

      return models.event
        .findById(quota.dataValues.eventId)
        .then(event =>
          event.getQuestions().then((questions) => {
            questions.map((question) => {
              const answer = _.find(userAnswers, { questionId: question.id });

              if (answer) {
                fields.push({
                  label: question.question,
                  answer: answer.answer,
                });
              }
            });
            return event;
          }),
        )
        .then((event) => {
          const params = {
            answers: fields,
            event: event.dataValues,
          };
          EmailService.sendConfirmationMail(hook.result.email, params);
        });
    });
};
