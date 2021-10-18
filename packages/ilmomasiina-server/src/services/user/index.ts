import { hooks as authHooks } from '@feathersjs/authentication';
import { hooks as localHooks } from '@feathersjs/authentication-local';
import { Service } from '@feathersjs/feathers';
import {
  disallow, iff, isProvider, keep, keepQuery,
} from 'feathers-hooks-common';
import sequelizeService from 'feathers-sequelize';

import config from '../../config';
import { IlmoApplication } from '../../defs';
import { User } from '../../models/user';
import generatePassword from './hooks/generatePassword';
import sendEmail from './hooks/sendEmail';

// Request schema for user creation.
export interface UserCreateBody {
  email: string;
}

// Response schema for user requests.
export interface UserDetails extends Pick<User, 'id' | 'email'> {}

export type UserListItem = UserDetails;

export type UserListResponse = UserListItem[];

// Hook context data type, used to pass generated password to sendEmail().
export interface NewUserData extends User {
  passwordPlain?: string;
}

export type UsersService = Service<User>;

export default function configureUserService(this: IlmoApplication) {
  const app = this;

  // Initialize our service with any options it requires
  app.use('/api/users', sequelizeService({ Model: User }));

  // Get our initialize service to that we can bind hooks
  const userService = app.service('/api/users');

  userService.hooks({
    before: {
      // Used by auth and /admin/users.
      find: [
        authHooks.authenticate('jwt'),
        // No query params allowed via API, to prevent password hash extraction etc.
        iff(isProvider('external'), keepQuery()),
      ],
      // Only used by auth, no access via API.
      get: [disallow('external')],
      // Used by /admin/users and for initial user creation.
      create: config.adminRegistrationAllowed ? [
        // Email and password can be provided for initial user creation.
        keep('email', 'password'),
        generatePassword(),
        localHooks.hashPassword('password'),
      ] : [
        authHooks.authenticate('jwt'),
        // Only email can be provided after initial creation is done.
        keep('email'),
        generatePassword(),
        localHooks.hashPassword('password'),
      ],
      // Unused. Enable for e.g. password change.
      update: [disallow()],
      patch: [disallow()],
      // Used by /admin/users.
      remove: [
        authHooks.authenticate('jwt'),
        // No query params allowed via API.
        keepQuery(),
      ],
    },
    after: {
      all: [localHooks.protect('password')],
      // Return only id and email for API responses.
      find: [iff(isProvider('external'), keep('id', 'email'))],
      // Send welcome email to new users.
      create: [sendEmail(), keep('id', 'email')],
      // Return only id for delete responses.
      remove: [keep('id')],
    },
  });
}
