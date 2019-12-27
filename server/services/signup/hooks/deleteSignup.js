const md5 = require('md5');
const config = require('../../../../config/ilmomasiina.config'); // eslint-disable-line

module.exports = () => hook => {
  const models = hook.app.get('models');
  const { id } = hook;
  const { editToken } = hook.params.query;

  if (editToken !== md5(`${`${hook.id}`}${config.editTokenSalt}`)) {
    throw new Error('Invalid editToken');
  }

  return models.signup
    .destroy({
      where: {
        id,
      },
    })
    .then(res => {
      hook.result = res;
      return hook;
    })
    .catch(error => hook);
};
