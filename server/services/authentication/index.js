const { AuthenticationService, JWTStrategy } = require('@feathersjs/authentication');
const { LocalStrategy } = require('@feathersjs/authentication-local');
const config = require('./../../../config/ilmomasiina.config.js');

module.exports = function () {
  const app = this;

  // Set up authentication with the secret
  app.set("authentication", {
    secret: config.feathersAuthSecret,
    service: 'api/users',
    authStrategies: [
      'local',
      'jwt',
    ],
    entity: 'user',
    jwtOptions: {
      expiresIn: "1h",
    },
    local: {
      usernameField: 'email',
      passwordField: 'password',
    },
  });

  const auth = new AuthenticationService(app);

  auth.register("jwt", new JWTStrategy());
  auth.register("local", new LocalStrategy());

  app.use('/api/authentication', auth);
};
