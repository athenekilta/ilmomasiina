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

const TEMPLATE_DIR = path.join(__dirname, '../../emails');

const TEMPLATE_OPTIONS = {
  juice: true,
  juiceResources: {
    preserveImportant: true,
    webResources: {
      relativeTo: path.join(TEMPLATE_DIR, 'css'),
    },
  },
};

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
    try {
      const email = new Email(TEMPLATE_OPTIONS);
      const brandedParams = {
        ...params,
        branding: {
          footerText: config.brandingMailFooterText,
          footerLink: config.brandingMailFooterLink,
        },
      };
      const html = await email.render(path.join(TEMPLATE_DIR, 'confirmation/html'), brandedParams);
      const subject = `${params.edited ? 'Muokkaus' : 'Ilmoittautumis'}vahvistus: ${params.event.title}`;
      await EmailService.send(to, subject, html);
    } catch (error) {
      console.error(error);
    }
  }

  static async sendNewUserMail(to: string, params: NewUserMailParams) {
    try {
      const email = new Email(TEMPLATE_OPTIONS);
      const brandedParams = {
        ...params,
        siteUrl: config.baseUrl,
        branding: {
          footerText: config.brandingMailFooterText,
          footerLink: config.brandingMailFooterLink,
        },
      };
      const html = await email.render(path.join(TEMPLATE_DIR, 'newUser/html'), brandedParams);
      const subject = 'Käyttäjätunnukset Ilmomasiinaan';
      await EmailService.send(to, subject, html);
    } catch (error) {
      console.error(error);
    }
  }

  static async sendPromotedFromQueueEmail(to: string, params: PromotedFromQueueMailParams) {
    try {
      const email = new Email(TEMPLATE_OPTIONS);
      const brandedParams = {
        ...params,
        branding: {
          footerText: config.brandingMailFooterText,
          footerLink: config.brandingMailFooterLink,
        },
      };
      const html = await email.render(path.join(TEMPLATE_DIR, 'queueMail/html'), brandedParams);
      const subject = `Pääsit varasijalta tapahtumaan ${params.event.title}`;
      await EmailService.send(to, subject, html);
    } catch (error) {
      console.error(error);
    }
  }
}
