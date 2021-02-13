const service = require('feathers-sequelize');
const hooks = require('./hooks.js');

module.exports = function () {
  const app = this;

  const options = {
    Model: app.get('models').event,
  };

  // Initialize our service with any options it requires
  app.use('/api/admin/events', service(options));

  // Get our initialize service to that we can bind hooks
  const eventService = app.service('/api/admin/events');

  eventService.hooks(hooks);
};
