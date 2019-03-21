const _ = require('lodash');

const config = {
  mysqlUser: process.env.MYSQL_USER,
  mysqlPassword: process.env.MYSQL_PASSWORD,
  mysqlDatabase: process.env.MYSQL_DATABASE,
  editTokenSalt: process.env.EDIT_TOKEN_SALT,
  mailFrom: process.env.MAIL_FROM,
  feathersAuthSecret: process.env.FEATHERS_AUTH_SECRET,
  mailgunApiKey: process.env.MAILGUN_API_KEY,
  mailgunDomain: process.env.MAILGUN_DOMAIN,
  sengridApiKey: process.env.SENDGRID_API_KEY, // temp sendgrid
  baseUrl: process.env.BASE_URL,
  prefixUrl: process.env.PREFIX_URL || '',
  adminRegistrationAllowed:
    process.env.ADMIN_REGISTRATION_ALLOWED == 'true' || false,
  brandingMailFooterText: process.env.BRANDING_MAIL_FOOTER_TEXT,
  brandingMailFooterLink: `${process.env.BASE_URL}${process.env.PREFIX_URL ||
    ''}`,
};

_.forOwn(config, (value, key) => {
  if (!value) {
    console.error(
      `Missing .env variable: ${key}, please check /config/ilmomasiina.config.js`,
    );
  }
});

module.exports = config;
