const authentication = require('feathers-authentication');
const jwt = require('feathers-authentication-jwt');
const local = require('feathers-authentication-local');
const config = require('./../../../config/ilmomasiina.config.js');

module.exports = function () {
  const app = this;
  // Set up authentication with the secret
  app.configure(authentication({
    secret: config.feathersAuthSecret,
    path: 'api/authentication',
    service: 'api/users',
    strategies: [
      'local',
      'jwt',
    ],
  }));

  app.configure(jwt());

  app.configure(local(local({
    entity: 'user',
    usernameField: 'email',
    passwordField: 'password',
  })));

  app.service('api/authentication').hooks({
    before: {
      create: [
        authentication.hooks.authenticate(['local', 'jwt']),
        context => {
          context.params.jwt = { expiresIn: 3600 }; // 1 hour
        }

      ],
      remove: [
        authentication.hooks.authenticate('jwt'),
      ],
    },
  });
};
