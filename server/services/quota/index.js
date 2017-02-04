const service = require('feathers-sequelize');
const hooks = require('./hooks.js');

module.exports = function () {
  const app = this;

  const options = {
    Model: app.get('models').quota,
  };

  // Initialize our service with any options it requires
  app.use('/api/quotas', service(options));

  // Get our initialize service to that we can bind hooks
  const quotaService = app.service('/api/quotas');

  // Set up our before hooks
  quotaService.before(hooks.before);

  // Set up our after hooks
  quotaService.after(hooks.after);
};
