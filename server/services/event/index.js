const service = require('feathers-sequelize');
const hooks = require('./hooks');

module.exports = function () {
  const app = this;

  const options = {
    Model: app.get('models').event,
  };

  // Initialize our service with any options it requires
  app.use('/api/events', service(options));

  // Get our initialize service to that we can bind hooks
  const eventService = app.service('/api/events');

  eventService.hooks(hooks);
};
