const service = require('feathers-sequelize');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: app.get('models').signup
  };

  // Initialize our service with any options it requires
  app.use('/api/signups', service(options));

  // Get our initialize service to that we can bind hooks
  const signupService = app.service('/api/signups');

  signupService.hooks({
    before: hooks.before,
    after: hooks.after
  });
};
