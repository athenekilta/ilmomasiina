const ilmoconfig = require('../../config/ilmomasiina.config.js'); // eslint-disable-line
const Email = require('email-templates');
const path = require('path');
const nodemailer = require('nodemailer')

require('dotenv').config();

if(!process.env.GMAIL_PASSWORD) throw new Error('.env GMAIL_password not defined!')

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
	user: "ilmo@athene.fi",
	pass: process.env.GMAIL_PASSWORD
	}
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
        const subjectFi = `${params.edited ? 'Muokkaus' : 'Ilmoittautumis'}vahvistus: ${params.event.title}`;
        const subjectEn = `${params.edited ? 'Signup edit' : 'Signup'} confirmation: ${params.event.title}`;
        const subject = subjectFi + ' // ' + subjectEn;
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
        const subject = 'Käyttäjätunnukset Ilmomasiinaan // Ilmomasiina login credentials';
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
        const subjectFi = 'Pääsit varasijalta tapahtumaan ' + params.event.title;
        const subjectEn = 'You now have a spot at event ' + params.event.title;
        const subject = subjectFi + ' // ' + subjectEn;
        return EmailService.send(to, subject, html);
      });
  },
};
module.exports = EmailService;
