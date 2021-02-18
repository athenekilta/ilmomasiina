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
        id
      },
    })
    .then((res) => {
      hook.result = res;
      return models.signup
        .destroy({
          where: {
            id
          },
        })
        .then((res) => {
          return hook;
        });
    })
    .catch(error => hook);
};
