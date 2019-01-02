const express = require('express');
const debug = require('debug')('app:server');
const compress = require('compression');
const feathers = require('feathers');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const bodyParser = require('body-parser');
const webpack = require('webpack');
const webpackConfig = require('../config/webpack.config');
const project = require('../config/project.config');

const models = require('./models');
const services = require('./services');

const app = feathers();

app
  .use(compress())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(hooks())
  .configure(rest())
  .configure(models)
  .configure(services)
  //Fucking feathers, have to add this shit to get error messages...
  .use(function (err, req, res, next) {
    if (err) {
      console.log('ERROR', err);
    }
  });

// Create tables if not exist
app.get('sequelize').sync();

app.use(require('connect-history-api-fallback')());

if (project.env === 'development') {
  const compiler = webpack(webpackConfig);

  debug('Enabling webpack dev and HMR middleware');

  app.use(
    require('webpack-dev-middleware')(compiler, {
      // eslint-disable-line
      publicPath: webpackConfig.output.publicPath,
      contentBase: project.paths.client(),
      hot: true,
      quiet: project.compiler_quiet,
      noInfo: project.compiler_quiet,
      lazy: false,
      stats: project.compiler_stats,
    }),
  );

  app.use(require('webpack-hot-middleware')(compiler)); // eslint-disable-line

  // Serve static assets from ~/public since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since this directory will be copied into ~/dist
  // when the application is compiled.
  app.use(express.static(project.paths.public()));
} else {
  debug(
    'Server is being run outside of live development mode, meaning it will ' +
    'only serve the compiled application bundle in ~/dist. Generally you ' +
    'do not need an application server for this and can instead use a web ' +
    'server such as nginx to serve your static files. See the "deployment" ' +
    'section in the README for more information on deployment strategies.', // eslint-disable-line
  );

  // Serving ~/dist by default. Ideally these files should be served by
  // the web server and not the app server, but this helps to demo the
  // server in production.
  app.use(express.static(project.paths.dist()));
}

module.exports = app;
