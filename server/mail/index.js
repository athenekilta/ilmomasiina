const ilmoconfig = require('../../config/ilmomasiina.config.js'); // eslint-disable-line
const sgMail = require('@sendgrid/mail');
const Email = require('email-templates');
const path = require('path');

sgMail.setApiKey(ilmoconfig.sendgridApiKey);

const EmailService = {
  send: () => {
    const email = new Email({
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, 'css'),
        },
      },
    });

    email
      .render('../../server/mail/emails/confirmation/html', {
        topText: 'Ilmoittautuminen onnistui!',
        eventName: 'Minuuttikalja',
        name: 'Juuso Lappalainen',
        email: 'juuso.lappalainen@juuso.com',
      })
      .then((html) => {
        const msg = {
          to: 'juuso.u.lappalainen@gmail.com',
          from: 'test@example.com',
          subject: 'Sending with SendGrid is Fun',
          text: 'and easy to do anywhere, even with Node.js',
          html,
        };

        sgMail
          .send(msg)
          .then((res) => {
            console.log('SUCCESS');
          })
          .catch((error) => {
            console.log('ERROR', error);
          });
      })
      .catch(console.error);
  },
};

module.exports = EmailService;
