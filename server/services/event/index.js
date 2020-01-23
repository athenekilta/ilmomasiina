const service = require('feathers-sequelize');
const hooks = require('./hooks');

module.exports = app => {
  const options = {
    Model: app.get('models').event
  };

  // Initialize our service with any options it requires
  app.use('/api/events', service(options));

  // Get our initialize service to that we can bind hooks
  const eventService = app.service('/api/events');

  eventService.hooks({
    before: hooks.before,
    after: hooks.after
  });
};
