const key = 'key-21742b8d559f009c4a811d8cc82950c2';
const d = 'sandbox0b82cf83277242c687ed9dd57ff24a0e.mailgun.org';
const mailgun = require('mailgun-js')({ apiKey: key, domain: d });
const debug = require('debug')('app:server');

const data = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: 'ilmomasiina@gmail.com',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomness!',
};

module.exports = () => { // 'function' needed as we use 'this'
  debug('Sending mail');
  mailgun.messages().send(data, (error, body) => {
    debug(body);
  });
};
