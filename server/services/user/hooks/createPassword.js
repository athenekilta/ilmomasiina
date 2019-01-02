const config = require('../../../../config/ilmomasiina.config.js');

module.exports = () => (hook) => {
  if (!config.adminRegistrationAllowed) {
    let password = '';
    const possible = 'abcdefghijklmnopqrstuvwxyzåäö0123456789';

    for (let i = 0; i < 24; i += 1) {
      password += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    hook.data.password = password;
    hook.data.passwordPlain = password;
    return hook
  }
};
