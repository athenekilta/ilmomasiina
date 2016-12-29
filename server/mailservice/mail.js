const ilmoconfig = require('../../config/ilmomasiina.config.js');
const debug = require('debug')('app:server');
const mailgun = require('mailgun-js')({
  apiKey: ilmoconfig.mailgunKey,
  domain: ilmoconfig.mailgunDomain,
});

const freeText =                                            // TODO work dynamically with backend
  `Jeee sä pääsit messiin! Tuu hulppeellaa meiningillä mestoille hyvissä ajoin\n\n
  Tässä viel maksutiedot:\n
  Saaja: joel\n
  Tilinumero: 293845729835\n
  `;

const editLink = 'https://muokkausTesti.jee.jee';
const removeLink = 'https://poistoTesti.jee.jee';

const generatedText =                                      // TODO work dynamically with backend
  `********************************************
  Ilmoittautumisen tiedot:\n
  Nimi: Ilmo Masiina\n
  Sähköposti: ilmomasiina@gmail.com\n
  Allergiat: -
  \n
  Voit poistaa ilmoittautumisen tämän linkin kautta: ${editLink}\n
  Voit muokata ilmoittautumistietoja tämän linkin kautta: ${removeLink}\n
  `;

const mergedText = `${freeText} \n\n ${generatedText}`;

const eventName = '(Ilmomasiina) EVENT_NAME (Ilmomasiina)'; // TODO work dynamically with backend

module.exports = (address) => {
  const data = {
    from: ilmoconfig.mailFrom,
    to: address,
    subject: eventName,
    text: mergedText,
  };
  debug('Sending mail');
  mailgun.messages().send(data, (error, body) => {
    debug(body);
  });
};
