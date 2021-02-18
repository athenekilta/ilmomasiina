import { HookContext } from '@feathersjs/feathers';
import { EventServiceItem } from '..';

export default () => (hook: HookContext<EventServiceItem>) => {
  const startDate = new Date(hook.result!.registrationStartDate!);
  const now = new Date();
  const endDate = new Date(hook.result!.registrationEndDate!);
  if (now > startDate) {
    hook.result!.millisTillOpening = 0;
  } else {
    hook.result!.millisTillOpening = startDate.getTime() - now.getTime();
  }
  if (now > endDate) {
    hook.result!.registrationClosed = true;
  }
};
