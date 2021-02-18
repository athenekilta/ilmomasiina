import moment from 'moment';
import { IlmoHookContext } from '../../../defs';
import { Quota } from '../../../models/quota';
import { Signup } from '../../../models/signup';

const signupsAllowed = (signupOpens: Date | null, signupCloses: Date | null) => {
  if (signupOpens === null && signupCloses === null) {
    return true;
  }

  const now = moment();

  const isOpened = now.isSameOrAfter(moment(signupOpens));
  const isClosed = now.isAfter(moment(signupCloses));

  return isOpened && !isClosed;
};

export default () => async (hook: IlmoHookContext<Signup>) => {
  // FIXME: this doesn't validate any fields!

  const { quotaId } = hook.data!;

  if (quotaId && Number.isSafeInteger(quotaId)) {
    const quota = await Quota.findByPk(quotaId);
    if (quota === null) {
      throw new Error('Quota doesn\'t exist.');
    }

    const event = await quota.getEvent();
    if (!signupsAllowed(event.registrationStartDate, event.registrationEndDate)) {
      throw new Error('Signups closed for this event.');
    }
  }
  throw new Error('Missing quota id.');
};
