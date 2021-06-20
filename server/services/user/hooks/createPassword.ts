import { HookContext } from '@feathersjs/feathers';
import _ from 'lodash';

import { UserServiceItem } from '..';
import config from '../../../config';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyzåäö0123456789';
const LENGTH = 24;

export default () => (hook: HookContext<UserServiceItem>) => {
  if (!config.adminRegistrationAllowed) {
    const password = _.times(LENGTH, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('');

    hook.data!.password = password;
    hook.data!.passwordPlain = password;
    return hook;
  }
  return undefined;
};
