const _ = require('lodash');
const moment = require('moment');
const EmailService = require('../../../mail/');
const config = require('../../../../config/ilmomasiina.config.js');

module.exports = () => hook => {
  const models = hook.app.get('models');

  const fields = [
    {
      label: 'Nimi',
      answer: `${hook.result.firstName} ${hook.result.lastName}`
    },
    { label: 'Sähköposti', answer: `${hook.result.email}` }
  ];

  const userAnswers = [];

  return models.answer
    .findAll({ where: { signupId: hook.result.id } })
    .then(answers => answers.map(answer => userAnswers.push(answer.dataValues)))
    .then(() => models.signup.findByPk(hook.result.id))
    .then(signup => models.quota.findByPk(signup.quotaId))
    .then(quota => {
      fields.push({ label: 'Kiintiö', answer: quota.title });

      return models.event
        .findByPk(quota.dataValues.eventId)
        .then(event =>
          event.getQuestions().then(questions => {
            questions.map(question => {
              const answer = _.find(userAnswers, { questionId: question.id });

              if (answer) {
                fields.push({
                  label: question.question,
                  answer: answer.answer
                });
              }
            });
            return event;
          })
        )
        .then(event => {
          const params = {
            answers: fields,
            edited: userAnswers.some(
              a => a.createdAt.getTime() !== a.updatedAt.getTime()
            ),
            date: moment(event.dataValues.date)
              .tz('Europe/Helsinki')
              .format('DD.MM.YYYY HH:mm'),
            event: event.dataValues,
            cancelLink: `${config.baseUrl}${config.prefixUrl}/signup/${hook.result.id}/${hook.data.editToken}`
          };
          EmailService.sendConfirmationMail(hook.result.email, params);
        });
    });
};
