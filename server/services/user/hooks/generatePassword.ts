import { HookContext } from '@feathersjs/feathers';
import _ from 'lodash';

import { NewUserData } from '..';
import config from '../../../config';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyzåäö0123456789';
const LENGTH = 24;

/** Set the new user's password to a generated one. */
export default () => (hook: HookContext<NewUserData>) => {
  // Allow setting a password if initial registration is allowed.
  if (config.adminRegistrationAllowed && hook.data?.password) {
    return hook;
  }

  const password = _.times(LENGTH, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('');

  return {
    ...hook,
    data: {
      ...hook.data!,
      password,
      passwordPlain: password,
    },
  };
};
