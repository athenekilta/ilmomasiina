import { HookContext } from '@feathersjs/feathers';

import { logEvent } from '../../../util/auditLog';
import { NewUserData } from '..';

export default (action: string) => async (hook: HookContext<NewUserData>) => {
  if (hook.result) {
    await logEvent(action, {
      extra: {
        id: hook.result.id,
        email: hook.result.email,
      },
      params: hook.params,
    });
  }
  return hook;
};
