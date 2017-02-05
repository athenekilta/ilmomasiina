const ilmoconfig = require('../../config/ilmomasiina.config.js'); // eslint-disable-line
const debug = require('debug')('app:server');

const mailgun = require('mailgun-js')({
  apiKey: ilmoconfig.mailgunKey,
  domain: ilmoconfig.mailgunDomain,
});

/*

  This file contains generic method for sending mail.

  Example:

  const mailservice = require('./');

  // User input fields
  const fields = [
    { label: 'Nimi', answer: 'Eero Esimerkki' },
    { label: 'Sähköposti', answer: 'eero@esimerkki.fi' },
    { label: 'Kilta', answer: 'Athene' },
  ];

  mailservice.sendSignUpConfirmation(
    'eero@esimerkki.fi',
    'Höpöhöpösitsit 12.1.2017',
    'Tervetuloa sitseille!\n\nMaksuohjeet: ...',
    'http://ilmomasiina.io/magical-edit-link',
    fields
  );

 */

// Generic method for sending mail
const sendMail = (msgTemplate, recipientEmail, eventTitle, customMsg, editLink = null, fields = null) => {
  debug('Sending mail');

  // We'll gather up message to one array and join it with line breaks at the end
  const msg = [];
  msg.push(msgTemplate);
  msg.push('\nTapahtuman järjestäjän ohjeet:');
  msg.push(customMsg);
  msg.push('\n– – –\n');
  if (editLink) msg.push(`Voit muokata tietojasi tai perua osallistumisesti osoitteessa: ${editLink}\n`);
  fields.map(field => msg.push(`${field.label}: ${field.answer}`));
  msg.push('\n– – –\n');
  msg.push('Vahvistusviesti on lähetetty automaattisesti, joten ethän vastaa tähän viestiin. Peace and love <3');

  const data = {
    from: ilmoconfig.mailFrom,
    to: recipientEmail,
    subject: `Ilmoittautumisvahvistus: ${eventTitle}`,
    text: msg.join('\n'),
  };

  return mailgun.messages().send(data, (error, body) => {
    debug(body);
  });
};

// Fixed message templates depending on action

const SIGNUP_MAIL = title =>
  `ILMOITTAUTUMISVAHVISTUS\n\nOlet ilmoittautunut tapahtumaan ${title}.`;

const FROM_QUEUE_MAIL = title =>
  `ILMOITTAUTUMISVAHVISTUS\n\nOlet saanut peruutuspaikan tapahtumaan ${title}.`;

const SIGNUP_EDITED_MAIL = title =>
  `VAHVISTUS ILMOITTAUTUMISEN MUOKKAUKSESTA\n\nOlet muokannut tietojasi tapahtuman ${title} ilmoittautumisessa.`;

module.exports = {
  sendSignUpConfirmation: (...args) => sendMail(SIGNUP_MAIL(args[1]), args[0], args[1], args[2], args[3], args[4]),
  sendSignUpFromQueueConfirmation: (...args) => sendMail(FROM_QUEUE_MAIL(args[1]), args[0], args[1], args[2], args[3], args[4]),
  sendEditConfirmation: (...args) => sendMail(SIGNUP_EDITED_MAIL(args[1]), args[0], args[1], args[2], args[3], args[4]),
};
