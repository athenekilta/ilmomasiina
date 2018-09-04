const config = require('../../../../config/ilmomasiina.config'); // eslint-disable-line
const md5 = require('md5');

module.exports = () => (hook) => {
  const models = hook.app.get('models');
  const id = hook.id;
  const editToken = hook.params.query.editToken;

  if (editToken !== md5(`${`${hook.id}`}${config.editTokenSalt}`)) {
    throw new Error('Invalid editToken');
  }

  return models.signup
    .findOne({
      where: {
        id,
      },
    })
    .then(signup =>
      models.quota
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
            .then((event) => {
              hook.result = {
                signup,
                event,
              };
              return hook;
            }),
        ),
    );
};
