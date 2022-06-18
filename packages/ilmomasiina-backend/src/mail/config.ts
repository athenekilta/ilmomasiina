import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import mailgun from 'nodemailer-mailgun-transport';

import config from '../config';

const mailTransporter: Transporter = (() => {
  if (config.mailgunApiKey) {
    if (!config.mailgunDomain) {
      throw new Error('Invalid email config: MAILGUN_DOMAIN must be set with MAILGUN_API_KEY.');
    }
    return nodemailer.createTransport(mailgun({
      auth: {
        api_key: config.mailgunApiKey,
        domain: config.mailgunDomain!,
      },
    }));
  }

  if (config.smtpHost) {
    if (!config.smtpUser || !config.smtpPassword) {
      throw new Error('Invalid email config: SMTP_USER and SMTP_PASSWORD must be set with SMTP_HOST.');
    }
    return nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort ?? undefined,
      secure: config.smtpTls,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPassword,
      },
    } as SMTPTransport.Options);
  }

  console.warn('Neither Mailgun nor SMTP is configured. Falling back to debug mail service.');
  return nodemailer.createTransport({
    name: 'debug mail service',
    version: '0',
    send(mail, callback?) {
      const { message } = mail;
      const envelope = message.getEnvelope();
      const messageId = message.messageId();
      const input = message.createReadStream();
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
})();

export default mailTransporter;
