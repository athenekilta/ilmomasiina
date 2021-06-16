import _ from 'lodash';

const config = {
  mysqlUser: process.env.MYSQL_USER,
  mysqlPassword: process.env.MYSQL_PASSWORD,
  mysqlDatabase: process.env.MYSQL_DATABASE,
  mysqlHost: process.env.MYSQL_HOST,
  editTokenSalt: process.env.EDIT_TOKEN_SALT,
  mailFrom: process.env.MAIL_FROM,
  feathersAuthSecret: process.env.FEATHERS_AUTH_SECRET,
  mailgunApiKey: process.env.MAILGUN_API_KEY,
  mailgunDomain: process.env.MAILGUN_DOMAIN,
  baseUrl: process.env.BASE_URL,
  prefixUrl: process.env.PREFIX_URL || '',
  adminRegistrationAllowed: process.env.ADMIN_REGISTRATION_ALLOWED === 'true',
  brandingMailFooterText: process.env.BRANDING_MAIL_FOOTER_TEXT,
  brandingMailFooterLink: `${process.env.BASE_URL}${process.env.PREFIX_URL || ''}`,
};

_.forOwn(config, (value, key) => {
  if (value === undefined) {
    throw new Error(`Missing .env variable: ${key}, please check server/config.ts`);
  }
});

export default config;
