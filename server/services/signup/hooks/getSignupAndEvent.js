const _ = require('lodash');
const config = require('../../../../config/ilmomasiina.config'); // eslint-disable-line
const md5 = require('md5');

module.exports = () => (hook) => {
  const models = hook.app.get('models');
  const id = hook.id;
  const editToken = hook.params.query.editToken;
  const fields = [];
  const userAnswers = [];

  if (editToken !== md5(`${`${hook.id}`}${config.editTokenSalt}`)) {
    throw new Error('Invalid editToken');
  }

  return models.answer
    .findAll({ where: { signupId: id } })
    .then(answers => answers.map(answer => userAnswers.push(answer.dataValues)))
    .then(() => models.signup
      .findOne({
        where: {
          id,
        },
      })
      .then(signup => {
        if (signup === null) { // Event not found with id, probably deleted
          hook.result = {
            signup,
            event: null,
          };
          return hook;
        }
        return models.quota
          .findOne({
            where: {
              id: signup.quotaId,
            },
          })
          .then(quota =>
            models.event
              .findOne({
                where: {
                  id: quota.eventId,
                },
              })
              .then((event) =>
                event.getQuestions().then((questions) => {
                  questions.map((question) => {
                    const answer = _.find(userAnswers, { questionId: question.id });

                    if (answer) {
                      fields.push({
                        ...question.dataValues,
                        answer: answer.answer,
                        answerId: answer.id,
                      });
                    }
                  });
                  hook.result = {
                    signup: { ...signup.dataValues, answers: fields },
                    event,
                  };
                  return hook;
                }),
              ),
          );
      }),
    );
};
