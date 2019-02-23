const config = require('../../../../config/ilmomasiina.config'); // eslint-disable-line
const md5 = require('md5');

module.exports = () => hook => {
  const editToken = hook.data.editToken;
  console.log(editToken);

  if (editToken !== md5(`${`${hook.id}`}${config.editTokenSalt}`)) {
    throw new Error('Invalid editToken');
  }
  return hook;
};
