const ilmoconfig = require('../../config/ilmomasiina.config.js');
const debug = require('debug')('app:server');
const mailgun = require('mailgun-js')({
  apiKey: ilmoconfig.mailgunKey,
  domain: ilmoconfig.mailgunDomain,
});

const sendMail = (msgTemplate, recipientEmail, eventTitle, customMsg, editLink = null, fields = null) => {
  debug('Sending mail');
  const msg = [];

  msg.push(msgTemplate);
  msg.push('\nTapahtumajärjestäjän ohjeet:');
  msg.push(customMsg);
  msg.push('\n– – –\n');

  if (editLink) msg.push(`Voit muokata tietojasi tai perua osallistumisesti osoitteessa: ${editLink}\n`);

  fields.map(field => msg.push(`${field.label}: ${field.answer}`));
  msg.push('\n– – –\n');
  msg.push('Vahvistusviesti on lähetetty automaattisesti, joten ethän vastaa tähän viestiin. Peace and love <3');

  const data = {
    from: ilmoconfig.mailFrom,
    to: recipientEmail,
    subject: `[Ilmoittautuminen] ${eventTitle}`,
    text: msg.join('\n'),
  };

  return mailgun.messages().send(data, (error, body) => {
    console.log(body);
  });
};

const SIGNUP_MAIL = 'Pääsit messiin.';
const FROM_QUEUE_MAIL = 'Pääsit jonosta messiin.';
const SIGNUP_EDITED_MAIL = 'Ilmoittautumistasi on muokattu.';

module.exports = {
  sendSignUpConfirmation: (...args) => sendMail(SIGNUP_MAIL, args[0], args[1], args[2], args[3], args[4]),
  sendSignUpFromQueueConfirmation: (...args) => sendMail(FROM_QUEUE_MAIL, args[0], args[1], args[2], args[3], args[4]),
  sendEditConfirmation: (...args) => sendMail(SIGNUP_EDITED_MAIL, args[0], args[1], args[2], args[3], args[4]),
};
