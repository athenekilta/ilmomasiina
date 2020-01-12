const _ = require('lodash');

const {
  DOCKER,
  USE_SENTRY,
  SENTRY_DSN,
  DB_DIALECT,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  EDIT_TOKEN_SALT,
  MAIL_FROM,
  FEATHERS_AUTH_SECRET,
  MAILGUN_API_KEY,
  MAILGUN_DOMAIN,
  BASE_URL,
  PREFIX_URL,
  ADMIN_REGISTRATION_ALLOWED,
  BRANDING_MAIL_FOOTER_TEXT
} = process.env;

const config = {
  useDocker: DOCKER,
  useSentry: USE_SENTRY,
  sentryDsn: SENTRY_DSN,
  dbDialect: DB_DIALECT,
  dbUser: DB_USER,
  dbPassword: DB_PASSWORD,
  dbDatabase: DB_DATABASE,
  editTokenSalt: EDIT_TOKEN_SALT,
  mailFrom: MAIL_FROM,
  feathersAuthSecret: FEATHERS_AUTH_SECRET,
  mailgunApiKey: MAILGUN_API_KEY,
  mailgunDomain: MAILGUN_DOMAIN,
  baseUrl: BASE_URL,
  prefixUrl: PREFIX_URL || '',
  adminRegistrationAllowed: ADMIN_REGISTRATION_ALLOWED == 'true' || false,
  brandingMailFooterText: BRANDING_MAIL_FOOTER_TEXT,
  brandingMailFooterLink: `${BASE_URL}${PREFIX_URL || ''}`
};

_.forOwn(config, (value, key) => {
  if (!value) {
    console.error(
      `Missing .env variable: ${key}, please check /config/ilmomasiina.config.js`
    );
  }
});

module.exports = config;
