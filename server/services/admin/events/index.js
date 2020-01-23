const service = require('feathers-sequelize');
const hooks = require('./hooks.js');

module.exports = app => {
  const options = {
    Model: app.get('models').event
  };

  app.use('/api/admin/events', service(options));

  app.service('/api/admin/events').hooks({
    before: hooks.before,
    after: hooks.after
  });
};
