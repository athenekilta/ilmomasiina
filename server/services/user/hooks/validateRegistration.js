const config = require('../../../../config/ilmomasiina.config.js');

module.exports = () => hook => {
  if (config.adminRegistrationAllowed) {
    return hook;
  }

  throw new Error('Admin user registration not allowed.');
};
