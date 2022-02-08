import fs from 'fs';
import path from 'path';

/**
 * Gets the location of the compiled frontend files from the environment or the default of 'frontend'.
 * Returns null if the environment variable is set but empty, or if the variable is unset and the default
 * directory does not exist.
 */
const getFrontendFilesPath = (): string | null => {
  const envValue = process.env.FRONTEND_FILES_PATH;

  // Empty value disables frontend serving
  if (envValue === '') {
    return null;
  }

  // See if the given or default paths exist
  const frontendPath = path.resolve(envValue || 'frontend');
  if (fs.existsSync(frontendPath) && fs.statSync(frontendPath).isDirectory()) {
    return frontendPath;
  }

  return null;
};

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  debugDbLogging: process.env.DEBUG_DB_LOGGING === 'true',

  port: process.env.PORT || 3000,

  enforceHttps: process.env.ENFORCE_HTTPS !== 'false',
  frontendFilesPath: getFrontendFilesPath(),

  clearDbUrl: process.env.CLEARDB_DATABASE_URL || null,
  dbDialect: process.env.DB_DIALECT,
  dbUser: process.env.DB_USER,
  dbHost: process.env.DB_HOST,
  dbPassword: process.env.DB_PASSWORD,
  dbDatabase: process.env.DB_DATABASE,

  oldEditTokenSalt: process.env.EDIT_TOKEN_SALT || null,
  newEditTokenSecret: process.env.NEW_EDIT_TOKEN_SECRET,
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
  deletionGracePeriod: process.env.DELETION_GRACE_PERIOD_DAYS || 14,
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

if (config.frontendFilesPath === null) {
  if (process.env.FRONTEND_FILES_PATH === '') {
    console.info('Frontend serving disabled in backend.');
  } else if (process.env.FRONTEND_FILES_PATH) {
    throw new Error(
      `FRONTEND_FILES_PATH is invalid: ${process.env.FRONTEND_FILES_PATH} does not exist or is not a directory`,
    );
  } else if (config.nodeEnv === 'production') {
    console.warn('Compiled frontend not found. Frontend will not be served by backend.');
  }
}

if (config.oldEditTokenSalt === config.newEditTokenSecret) {
  throw new Error(
    'Don\'t use the same secret for EDIT_TOKEN_SALT and NEW_EDIT_TOKEN_SECRET. '
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

if (config.nodeEnv === 'production') {
  if (config.enforceHttps) {
    console.info('Enforcing HTTPS connections');
  } else {
    console.warn(
      'HTTPS connections are not enforced by Ilmomasiina.\n'
      + 'For security reasons, please set ENFORCE_HTTPS=true or configure your load balancer or reverse proxy to'
      + 'forward only HTTPS connections to Ilmomasiina.',
    );
  }
}

export default config;
