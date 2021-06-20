import { hooks as authHooks } from '@feathersjs/authentication';
import { hooks as localHooks } from '@feathersjs/authentication-local';
import { disallow } from 'feathers-hooks-common';

import config from '../../../config';
import createPassword from './createPassword';
import sendEmail from './sendEmail';

const createHook = config.adminRegistrationAllowed
  ? [createPassword(), localHooks.hashPassword('password')]
  : [authHooks.authenticate('jwt'), createPassword(), localHooks.hashPassword('password')];

export default {
  before: {
    all: [],
    // Used by auth and /admin/users.
    find: [authHooks.authenticate('jwt')],
    // Used by auth.
    get: [disallow('external')],
    // Used by /admin/users and for initial user creation.
    create: createHook,
    // Unused. Enable for e.g. password change.
    update: [disallow(), localHooks.hashPassword('password')],
    patch: [disallow(), localHooks.hashPassword('password')],
    // Used by /admin/users.
    remove: [authHooks.authenticate('jwt')],
  },
  after: {
    all: [localHooks.protect('password')],
    find: [],
    get: [],
    create: [sendEmail()],
    update: [],
    patch: [],
    remove: [],
  },
};
