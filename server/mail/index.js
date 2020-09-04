const ilmoconfig = require('../../config/ilmomasiina.config.js'); // eslint-disable-line
const Email = require('email-templates');
const path = require('path');
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'smtp.ayy.fi',
  port: 25,
});

const EmailService = {
  send: (to, subject, html) => {
    const msg = {
      to,
      from: ilmoconfig.mailFrom,
      subject,
      html,
    };

    return transporter.sendMail(msg);
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

    return email
      .render('../server/mail/emails/confirmation/html', brandedParams)
      .then(html => {
        const subject = `${params.edited ? 'Muokkaus' : 'Ilmoittautumis'}vahvistus: ${params.event.title}`;
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

    return email
      .render('../server/mail/emails/newUser/html', brandedParams)
      .then(html => {
        const subject = 'Käyttäjätunnukset Ilmomasiinaan';
        return EmailService.send(to, subject, html);
      });
  },


  sendQueueEmail(to, params) {
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
    return email
      .render('../server/mail/emails/queueMail/html', brandedParams)
      .then(html => {
        const subject = 'Pääsit varasijalta tapahtumaan ' + params.event.title;
        return EmailService.send(to, subject, html);
      });
  },
};
module.exports = EmailService;
