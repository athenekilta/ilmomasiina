const service = require('feathers-sequelize');
const hooks = require('./hooks.js');

module.exports = function () {
  const app = this;

  const options = {
    Model: app.get('models').user,
  };

  // Initialize our service with any options it requires
  app.use('/api/users', service(options));
  // Get our initialize service to that we can bind hooks
  const userService = app.service('/api/users');

  // Set up our before hooks
  userService.before(hooks.before);

  // Set up our after hooks
  userService.after(hooks.after);
};
