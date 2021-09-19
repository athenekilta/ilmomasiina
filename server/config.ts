const config = {
  nodeEnv: process.env.NODE_ENV || 'development',

  port: process.env.PORT || 3000,

  dockerCompose: process.env.DOCKER_COMPOSE === 'true',

  clearDbUrl: process.env.CLEARDB_DATABASE_URL || null,
  dbDialect: process.env.DB_DIALECT,
  dbUser: process.env.DB_USER,
  dbHost: process.env.DB_HOST,
  dbPassword: process.env.DB_PASSWORD,
  dbDatabase: process.env.DB_DATABASE,

  editTokenSalt: process.env.EDIT_TOKEN_SALT,
  feathersAuthSecret: process.env.FEATHERS_AUTH_SECRET,

  mailFrom: process.env.MAIL_FROM,
  brandingMailFooterText: process.env.BRANDING_MAIL_FOOTER_TEXT,
  brandingMailFooterLink: process.env.BRANDING_MAIL_FOOTER_LINK,
  mailUrlBase: process.env.EMAIL_BASE_URL,
  pathPrefix: process.env.PATH_PREFIX || '',

  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT || 587,
  smtpUser: process.env.SMTP_USER,
  smtpPassword: process.env.SMTP_PASSWORD,
  mailgunApiKey: process.env.MAILGUN_API_KEY,
  mailgunDomain: process.env.MAILGUN_DOMAIN,

  adminRegistrationAllowed: process.env.ADMIN_REGISTRATION_ALLOWED === 'true',

  anonymizeAfterDays: process.env.ANONYMIZE_AFTER_DAYS || 180,
};

Object.entries(config).forEach(([key, value]) => {
  if (value === undefined) {
    throw new Error(`Missing .env variable: ${key}, please check server/config.ts`);
  }
});

if (!['development', 'test', 'production'].includes(config.nodeEnv)) {
  throw new Error('NODE_ENV must be one of development, test, production');
}

if (!config.port && config.nodeEnv === 'production') {
  throw new Error('Missing .env variable: PORT');
}

if (config.adminRegistrationAllowed) {
  console.warn(
    '----------------------------------------------------\n'
    + 'WARNING!\nAdmin registration is enabled, meaning anyone can register an administrator account.\n'
    + 'After creating your initial administrator account, make sure to set ADMIN_REGISTRATION_ALLOWED=false.\n'
    + '----------------------------------------------------',
  );
}

export default config;
