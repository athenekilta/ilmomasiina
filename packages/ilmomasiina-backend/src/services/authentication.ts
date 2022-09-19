import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication';
import { LocalStrategy } from '@feathersjs/authentication-local';
import { Params } from '@feathersjs/feathers';
import _ from 'lodash';

import config from '../config';
import { IlmoApplication } from '../defs';

// By default, LocalStrategy calls GET /api/users with provider=rest to get the subject.
// As we disallow that API externally, we need to drop the provider param from the call.
// We then only pass on the user ID and email to be safe.
// https://github.com/feathersjs/feathers/issues/1496
class CustomLocalStrategy extends LocalStrategy {
  async getEntity(result: any, params: Params) {
    const entity = await super.getEntity(result, _.omit(params, 'provider'));
    return entity && _.pick(entity, 'id', 'email');
  }
}

export default function setupAuthentication(this: IlmoApplication) {
  const app = this;

  // Generate super-long-lived JWTs in development mode
  const expiresIn = config.nodeEnv === 'development' ? '365d' : '7d';

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
      expiresIn,
    },
    local: {
      usernameField: 'email',
      passwordField: 'password',
    },
  });

  const auth = new AuthenticationService(app);

  auth.register('jwt', new JWTStrategy());
  auth.register('local', new CustomLocalStrategy());

  app.use('/api/authentication', auth);
}
