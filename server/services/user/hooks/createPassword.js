module.exports = () => (hook) => {
  let password = '';
  const possible = 'abcdefghijklmnopqrstuvwxyzåäö0123456789';

  for (let i = 0; i < 24; i += 1) {
    password += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  hook.data.password = password;
  hook.data.passwordPlain = password;
};
