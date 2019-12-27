const md5 = require('md5');
const config = require('../../../../config/ilmomasiina.config'); // eslint-disable-line

module.exports = () => hook => {
  hook.result.editToken = md5(`${hook.result.id}${config.editTokenSalt}`);
};
