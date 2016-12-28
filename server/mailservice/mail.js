const ilmoconfig = require('../../config/ilmomasiina.config.js');
const debug = require('debug')('app:server');
const mailgun = require('mailgun-js')({ apiKey: ilmoconfig.mailKey, domain: ilmoconfig.mailDomain });

module.exports = (address) => {
  const data = {
    from: ilmoconfig.mailFrom,
    to: address,
    subject: 'Hello',
    text: 'Testing some Mailgun awesomness!',
  };
  debug('Sending mail');
  mailgun.messages().send(data, (error, body) => {
    debug(body);
  });
};
