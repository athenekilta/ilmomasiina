import ilmoconfig from '../config/ilmomasiina.config.js'; // eslint-disable-line
import Email from 'email-templates';
import path from 'path';
import nodemailer from 'nodemailer';
import { Event } from '../models/event.js';

const transporter = nodemailer.createTransport({
  host: 'smtp.ayy.fi',
  port: 25,
});

export interface ConfirmationMailParams {
  answers: {
    label: string;
    answer: string;
  }[];
  edited: boolean;
  date: string;
  event: Event;
  cancelLink: string;
}

export interface NewUserMailParams {
  fields: {
    label: string;
    answer: string;
  }[];
}

export interface PromotedFromQueueMailParams {
  event: Event;
  date: string;
}

const EmailService = {
  send: (to: string, subject: string, html: string) => {
    const msg = {
      to,
      from: ilmoconfig.mailFrom,
      subject,
      html,
    };

    return transporter.sendMail(msg);
  },

  async sendConfirmationMail(to: string, params: ConfirmationMailParams) {
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
    const html = await email.render('../server/mail/emails/confirmation/html', brandedParams);
    const subject = `${params.edited ? 'Muokkaus' : 'Ilmoittautumis'}vahvistus: ${params.event.title}`;
    return EmailService.send(to, subject, html);
  },

  async sendNewUserMail(to: string, params: NewUserMailParams) {
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
    const html = await email.render('../server/mail/emails/newUser/html', brandedParams);
    const subject = 'Käyttäjätunnukset Ilmomasiinaan';
    return EmailService.send(to, subject, html);
  },

  async sendPromotedFromQueueEmail(to: string, params: PromotedFromQueueMailParams) {
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
    const html = await email.render('../server/mail/emails/queueMail/html', brandedParams);
    const subject = `Pääsit varasijalta tapahtumaan ${params.event.title}`;
    return EmailService.send(to, subject, html);
  },
};

export default EmailService;
