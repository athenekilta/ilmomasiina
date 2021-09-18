import Email from 'email-templates';
import nodemailer, { Transporter } from 'nodemailer';
import mailgun from 'nodemailer-mailgun-transport';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import path from 'path';

import config from '../config';
import { Event } from '../models/event.js';

let transporter: Transporter;
if (config.mailgunApiKey) {
  transporter = nodemailer.createTransport(mailgun({
    auth: {
      api_key: config.mailgunApiKey,
      domain: config.mailgunDomain!,
    },
  }));
} else if (config.smtpHost) {
  transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    auth: {
      user: config.smtpUser,
    },
  } as SMTPTransport.Options);
} else {
  console.warn('Neither Mailgun nor SMTP is configured. Falling back to debug mail service.');
  transporter = nodemailer.createTransport({
    name: 'debug mail service',
    version: '0',
    send(mail, callback?) {
      const envelope = mail.message.getEnvelope();
      const messageId = mail.message.messageId();
      const input = mail.message.createReadStream();
      let data = '';
      input.on('data', (chunk) => {
        data += chunk;
      });
      input.on('end', () => {
        console.log(data);
        callback(null, { envelope, messageId } as any);
      });
    },
  });
}

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

export default class EmailService {
  static send(to: string, subject: string, html: string) {
    const msg = {
      to,
      from: config.mailFrom,
      subject,
      html,
    };

    return transporter.sendMail(msg);
  }

  static async sendConfirmationMail(to: string, params: ConfirmationMailParams) {
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
        footerText: config.brandingMailFooterText,
        footerLink: config.brandingMailFooterLink,
      },
    };
    const html = await email.render('../server/mail/emails/confirmation/html', brandedParams);
    const subject = `${params.edited ? 'Muokkaus' : 'Ilmoittautumis'}vahvistus: ${params.event.title}`;
    return EmailService.send(to, subject, html);
  }

  static async sendNewUserMail(to: string, params: NewUserMailParams) {
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
        footerText: config.brandingMailFooterText,
        footerLink: config.brandingMailFooterLink,
        siteUrl: `${config.mailUrlBase}${config.pathPrefix}`,
      },
    };
    const html = await email.render('../server/mail/emails/newUser/html', brandedParams);
    const subject = 'Käyttäjätunnukset Ilmomasiinaan';
    return EmailService.send(to, subject, html);
  }

  static async sendPromotedFromQueueEmail(to: string, params: PromotedFromQueueMailParams) {
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
        footerText: config.brandingMailFooterText,
        footerLink: config.brandingMailFooterLink,
      },
    };
    const html = await email.render('../server/mail/emails/queueMail/html', brandedParams);
    const subject = `Pääsit varasijalta tapahtumaan ${params.event.title}`;
    return EmailService.send(to, subject, html);
  }
}
