const service = require('feathers-sequelize');
const hooks = require('./hooks.js');

module.exports = function() {
  const app = this;

  const options = {
    Model: app.get('models').user
  };

  // Initialize our service with any options it requires
  app.use('/api/users', service(options));

  // Get our initialize service to that we can bind hooks
  const userService = app.service('/api/users');

  userService.hooks({
    before: hooks.before,
    after: hooks.after
  });
};
