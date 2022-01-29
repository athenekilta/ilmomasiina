/* eslint key-spacing:0 spaced-comment:0 */
const path = require('path');
const debug = require('debug')('app:config:project');
const argv = require('yargs').argv;
const ip = require('ip');

debug('Creating default configuration.');
// ========================================================
// Default Configuration
// ========================================================
const config = {
  env : process.env.NODE_ENV || 'development',

  // ----------------------------------
  // Project Structure
  // ----------------------------------
  path_base  : path.resolve(__dirname, '..'),
  dir_client : 'src',
  dir_dist   : 'dist',
  dir_public : 'public',
  dir_server : 'server',
  dir_test   : 'tests',

  // ----------------------------------
  // Server Configuration
  // ----------------------------------
  // Prevents the use of ip address if ran in container, as the ip address is unreachable.
  server_host : process.env.DOCKER_ENV || ip.address(), // use string 'localhost' to prevent exposure on local network
  server_port : process.env.PORT || 3000,

  // ----------------------------------
  // Compiler Configuration
  // ----------------------------------
  compiler_babel : {
    cacheDirectory : true,
    plugins        : ['transform-runtime'],
    presets        : ['es2015', 'react', 'stage-0'],
  },
  compiler_devtool         : 'source-map',
  compiler_hash_type       : 'hash',
  compiler_fail_on_warning : false,
  compiler_quiet           : false,
  compiler_public_path     : '/',
  compiler_stats           : {
    chunks : false,
    chunkModules : false,
    colors : true,
  },
  compiler_vendors : [
    'react',
    'react-redux',
    'react-router',
    'redux',
  ],

  // ----------------------------------
  // Test Configuration
  // ----------------------------------
  coverage_reporters : [
    { type : 'text-summary' },
    { type : 'lcov', dir : 'coverage' },
  ],
};

/************************************************
-------------------------------------------------

All Internal Configuration Below
Edit at Your Own Risk

-------------------------------------------------
************************************************/

// ------------------------------------
// Environment
// ------------------------------------
// N.B.: globals added here must _also_ be added to .eslintrc
config.globals = {
  'process.env'  : {
    NODE_ENV : JSON.stringify(config.env),
  },
  NODE_ENV     : config.env,
  DEV      : config.env === 'development',
  PROD     : config.env === 'production',
  TEST     : config.env === 'test',
  COVERAGE : !argv.watch && config.env === 'test',
  BASENAME : JSON.stringify(process.env.BASENAME || ''),
  PREFIX_URL : JSON.stringify(process.env.PREFIX_URL || ''),
  BRANDING_HEADER_TITLE: JSON.stringify(process.env.BRANDING_HEADER_TITLE_TEXT),
  BRANDING_FOOTER_GDPR_TEXT: JSON.stringify(process.env.BRANDING_FOOTER_GDPR_TEXT),
  BRANDING_FOOTER_GDPR_LINK: JSON.stringify(process.env.BRANDING_FOOTER_GDPR_LINK),
  BRANDING_FOOTER_HOME_TEXT: JSON.stringify(process.env.BRANDING_FOOTER_HOME_TEXT),
  BRANDING_FOOTER_HOME_LINK: JSON.stringify(process.env.BRANDING_FOOTER_HOME_LINK),
};

// ------------------------------------
// Validate Vendor Dependencies
// ------------------------------------
const pkg = require('../package.json');

config.compiler_vendors = config.compiler_vendors
  .filter((dep) => { // eslint-disable-line
    if (pkg.dependencies[dep]) return true;

    /* eslint-disable */
    debug(
      `Package "${dep}" was not found as an npm dependency in package.json; ` +
      `it won't be included in the webpack vendor bundle.
       Consider removing it from \`compiler_vendors\` in ~/config/index.js`
    )
    /* eslint-enable */
  });

// ------------------------------------
// Utilities
// ------------------------------------
function base() {
  const args = [config.path_base].concat([].slice.call(arguments)); // eslint-disable-line
  return path.resolve.apply(path, args); // eslint-disable-line
}

config.paths = {
  base,
  client : base.bind(null, config.dir_client),
  public : base.bind(null, config.dir_public),
  dist   : base.bind(null, config.dir_dist),
};

// ========================================================
// Environment Configuration
// ========================================================
debug(`Looking for environment overrides for NODE_ENV "${config.env}".`);

const environments = require('./environments.config');

const overrides = environments[config.env];
if (overrides) {
  debug('Found overrides, applying to default configuration.');
  Object.assign(config, overrides(config));
} else {
  debug('No environment overrides found, defaults will be used.');
}

module.exports = config;
