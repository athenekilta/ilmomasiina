const service = require('feathers-sequelize');
const hooks = require('./hooks');

module.exports = function () {
    const app = this;

    const options = {
        Model: app.get('models').signup,
    };

    // Initialize our service with any options it requires
    app.use('/api/admin/signups', service(options));

    // Get our initialize service to that we can bind hooks
    const signupService = app.service('/api/admin/signups');

    // Set up our before hooks
    signupService.before(hooks.before);

    // Set up our after hooks
    signupService.after(hooks.after);
};
