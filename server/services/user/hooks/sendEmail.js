const EmailService = require('../../../mail');

module.exports = () => hook => {
  const fields = [
    { label: 'Sähköposti', answer: hook.result.email },
    { label: 'Salasana', answer: hook.data.passwordPlain },
  ];

  EmailService.sendNewUserMail(hook.result.email, { fields });
};
