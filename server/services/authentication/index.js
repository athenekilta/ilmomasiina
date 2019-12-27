const {
  AuthenticationService,
  JWTStrategy,
} = require('@feathersjs/authentication');
const { LocalStrategy } = require('@feathersjs/authentication-local');
const config = require('./../../../config/ilmomasiina.config.js');

module.exports = app => {
  // Set up authentication with the secret
  app.set('authentication', {
    entity: 'user',
    service: 'api/users',
    secret: config.feathersAuthSecret,
    authStrategies: ['local', 'jwt'],
    jwtOptions: {
      header: { typ: 'access' },
      algorithm: 'HS256',
      expiresIn: '1h',
    },
    local: {
      usernameField: 'email',
      passwordField: 'password',
    },
  });

  const authService = new AuthenticationService(app);

  authService.register('jwt', new JWTStrategy());
  authService.register('local', new LocalStrategy());

  app.use('/api/authentication', authService);
};
