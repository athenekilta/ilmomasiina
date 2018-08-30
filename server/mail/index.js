const ilmoconfig = require('../../config/ilmomasiina.config.js'); // eslint-disable-line
const sgMail = require('@sendgrid/mail');
const Email = require('email-templates');
const path = require('path');

sgMail.setApiKey(ilmoconfig.sendgridApiKey);

const EmailService = {
  send: (to, subject, html) => {
    const msg = {
      to,
      from: ilmoconfig.mailFrom,
      subject,
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
  },

  sendConfirmationMail(to, params) {
    const email = new Email({
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, 'css'),
        },
      },
    });

    return email
      .render('../../server/mail/emails/confirmation/html', {
        topText: params.topText,
        eventName: params.eventName,
        name: params.name,
        email: params.email,
      })
      .then((html) => {
        const subject = `Ilmoittautuminen onnistui | ${params.eventName}`;
        return EmailService.send(to, subject, html);
      });
  },
};

module.exports = EmailService;
