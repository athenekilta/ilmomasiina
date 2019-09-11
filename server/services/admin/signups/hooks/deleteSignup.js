const logger = require('../../../../logger');

module.exports = () => hook => {
  const models = hook.app.get('models');
  const id = hook.id;
  logger.info('Deleting id %d', id);
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
