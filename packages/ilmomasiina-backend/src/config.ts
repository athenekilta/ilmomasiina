import {
  envBoolean, envEnum, envInteger, envString, frontendFilesPath,
} from './util/config';

const config = <const>{
  nodeEnv: envEnum('NODE_ENV', ['production', 'development', 'test'], 'development'),
  debugDbLogging: envBoolean('DEBUG_DB_LOGGING', false),

  port: envInteger('PORT', 3000),

  enforceHttps: envEnum('ENFORCE_HTTPS', ['false', 'proxy', 'azure'], 'false'),
  frontendFilesPath: frontendFilesPath(),

  clearDbUrl: envString('CLEARDB_DATABASE_URL', null),
  dbDialect: envString('DB_DIALECT', null),
  dbUser: envString('DB_USER', null),
  dbHost: envString('DB_HOST', null),
  dbPassword: envString('DB_PASSWORD', null),
  dbDatabase: envString('DB_DATABASE', null),

  oldEditTokenSalt: envString('EDIT_TOKEN_SALT', null),
  newEditTokenSecret: envString('NEW_EDIT_TOKEN_SECRET'),
  feathersAuthSecret: envString('FEATHERS_AUTH_SECRET'),

  mailFrom: envString('MAIL_FROM'),
  brandingMailFooterText: envString('BRANDING_MAIL_FOOTER_TEXT'),
  brandingMailFooterLink: envString('BRANDING_MAIL_FOOTER_LINK'),
  mailUrlBase: envString('EMAIL_BASE_URL'),
  pathPrefix: envString('PATH_PREFIX', ''),

  smtpHost: envString('SMTP_HOST', null),
  smtpPort: envInteger('SMTP_PORT', null),
  smtpTls: envBoolean('SMTP_TLS', false),
  smtpUser: envString('SMTP_USER', null),
  smtpPassword: envString('SMTP_PASSWORD', null),
  mailgunApiKey: envString('MAILGUN_API_KEY', null),
  mailgunDomain: envString('MAILGUN_DOMAIN', null),

  adminRegistrationAllowed: envBoolean('ADMIN_REGISTRATION_ALLOWED', false),

  anonymizeAfterDays: envInteger('ANONYMIZE_AFTER_DAYS', 180),
  deletionGracePeriod: envInteger('DELETION_GRACE_PERIOD_DAYS', 14),
};

if (!process.env.PORT && config.nodeEnv === 'production') {
  throw new Error('Env variable PORT must be set in production');
}

if (config.frontendFilesPath === null) {
  if (process.env.FRONTEND_FILES_PATH === '') {
    console.info('Frontend serving disabled in backend.');
  } else if (config.nodeEnv === 'production') {
    console.info('Compiled frontend not found. Frontend will not be served by backend.');
  }
}

if (config.oldEditTokenSalt === config.newEditTokenSecret) {
  throw new Error(
    'Don\'t use the same secret for EDIT_TOKEN_SALT and NEW_EDIT_TOKEN_SECRET.\n'
    + 'If this is a new installation, leave EDIT_TOKEN_SALT empty. If this is an old installation, '
    + 'leave EDIT_TOKEN_SALT as is and generate a new secret for NEW_EDIT_TOKEN_SECRET.',
  );
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
