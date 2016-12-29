
const ilmoconfig = require('../../config/ilmomasiina.config.js');
const debug = require('debug')('app:server');
const app = require('../main.js');
const mailgun = require('mailgun-js')({
  apiKey: ilmoconfig.mailgunKey,
  domain: ilmoconfig.mailgunDomain,
});

const freeText =                                            // TODO work dynamically with backend
  `Jeee sä pääsit messiin! Tuu hulppeellaa meiningillä mestoille hyvissä ajoin!\n\n
  Tässä viel maksutiedot:\n
  Saaja: joel\n
  Tilinumero: 293845729835\n
  `;

const editLink = 'https://muokkausTesti.jee.jee';           // TODO work dynamically with backend
const generatedText =
  `********************************************
  Ilmoittautumisen tiedot:\n
  Nimi: Ilmo Masiina\n
  Sähköposti: ilmomasiina@gmail.com\n
  Allergiat: -
  \n
  Voit poistaa ilmoittautumisen tämän linkin kautta: ${editLink}\n
  `;

const mergedText = `${freeText} \n ${generatedText}`;
const eventName = '(Ilmomasiina) EVENT_NAME (Ilmomasiina)'; // TODO work dynamically with backend

module.exports = (signupId) => {
  const attendee = app.service('/api/attendees').get(signupId);
//  const event = app.service('api/attendees').get()
  debug(attendee);
  const data = {
    from: ilmoconfig.mailFrom,
    to: attendee.email,
    subject: eventName,
    text: mergedText,
  };
  debug('Sending mail');
  mailgun.messages().send(data, (error, body) => {
    debug(body);
  });
};
