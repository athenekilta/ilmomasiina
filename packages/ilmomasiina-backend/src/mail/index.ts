import Email from 'email-templates';
import path from 'path';

import config from '../config';
import { Event } from '../models/event';
import mailTransporter from './config';

export interface ConfirmationMailParams {
  answers: {
    label: string;
    answer: string;
  }[];
  edited: boolean;
  date: string | null;
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
  date: string | null;
}

export default class EmailService {
  static send(to: string, subject: string, html: string) {
    const msg = {
      to,
      from: config.mailFrom,
      subject,
      html,
    };

    return mailTransporter.sendMail(msg);
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
    const html = await email.render(path.join(__dirname, 'emails/confirmation/html'), brandedParams);
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
    const html = await email.render(path.join(__dirname, 'emails/newUser/html'), brandedParams);
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
    const html = await email.render(path.join(__dirname, 'emails/queueMail/html'), brandedParams);
    const subject = `Pääsit varasijalta tapahtumaan ${params.event.title}`;
    return EmailService.send(to, subject, html);
  }
}
