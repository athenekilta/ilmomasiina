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
    const brandedParams = {
      ...params,
      branding: {
        footerText: ilmoconfig.brandingMailFooterText,
        footerLink: ilmoconfig.brandingMailFooterLink,
      },
    };

    return email.render('../server/mail/emails/confirmation/html', brandedParams).then((html) => {
      const subject = `Ilmoittautumisvahvistus: ${params.event.title}`;
      return EmailService.send(to, subject, html);
    });
  },

  sendNewUserMail(to, params) {
    const email = new Email({
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, 'css'),
        },
      },
    });
    const brandedParams = {
      ...params,
      branding: {
        footerText: ilmoconfig.brandingMailFooterText,
        footerLink: ilmoconfig.brandingMailFooterLink,
        siteUrl: ilmoconfig.baseUrl,
      },
    };

    return email.render('../server/mail/emails/newUser/html', brandedParams).then((html) => {
      const subject = 'Käyttäjätunnukset Ilmomasiinaan';
      return EmailService.send(to, subject, html);
    });
  },
};

module.exports = EmailService;
