import { Dialect, Options, Sequelize } from 'sequelize';

import appConfig from '../config';

const {
  clearDbUrl,
  dbDialect, dbHost, dbPort, dbSsl, dbDatabase, dbUser, dbPassword,
  debugDbLogging,
} = appConfig;

let auth: Options;

if (clearDbUrl) {
  // Use Sequelize's code to parse the database URL
  const parsed = new Sequelize(clearDbUrl);
  const {
    host, port, database, username, password, dialectOptions,
  } = parsed.config;
  auth = {
    dialect: parsed.getDialect() as Dialect,
    port: port ? Number(port) : undefined,
    host,
    database,
    username,
    password: password ?? undefined,
    dialectOptions,
  };
} else if (dbDialect) {
  auth = {
    dialect: dbDialect as Dialect,
    host: dbHost!,
    port: dbPort ?? undefined,
    database: dbDatabase!,
    username: dbUser!,
    password: dbPassword ?? undefined,
    dialectOptions: dbSsl ? { ssl: true } : {},
  };
  if (!dbDatabase || !dbUser) {
    throw new Error('Invalid database config: DB_HOST, DB_DATABASE and DB_USER must be set with DB_DIALECT.');
  }
} else {
  throw new Error('Missing database config: DB_DIALECT or CLEARDB_DATABASE_URL must be set.');
}

// Add extra options
const sequelizeConfig = {
  ...auth,
  logging: debugDbLogging,
};

export = {
  // Sequelize CLI uses development as default NODE_ENV
  development: sequelizeConfig,
  // ...but make sure we can also run migrate with NODE_ENV=production
  production: sequelizeConfig,
  // Also export it under a environment-neutral name
  default: sequelizeConfig,
};
