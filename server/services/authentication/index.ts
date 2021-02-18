import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication';
import { LocalStrategy } from '@feathersjs/authentication-local';
import { IlmoApplication } from '../../defs';
import config from '../../config/ilmomasiina.config';

export default function (this: IlmoApplication) {
  const app = this;

  // Set up authentication with the secret
  app.set('authentication', {
    secret: config.feathersAuthSecret,
    service: 'api/users',
    authStrategies: [
      'local',
      'jwt',
    ],
    entity: 'user',
    jwtOptions: {
      expiresIn: '1h',
    },
    local: {
      usernameField: 'email',
      passwordField: 'password',
    },
  });

  const auth = new AuthenticationService(app);

  auth.register('jwt', new JWTStrategy());
  auth.register('local', new LocalStrategy());

  app.use('/api/authentication', auth);
};
