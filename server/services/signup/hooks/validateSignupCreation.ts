import moment from 'moment';
import { Model } from 'sequelize';
import { IlmoHookContext } from '../../../defs';
import { Event } from '../../../models/event';
import { Quota } from '../../../models/quota';
import { Signup } from '../../../models/signup';

const signupsAllowed = (event: Event) => {
  if (event.registrationStartDate === null && event.registrationEndDate === null) {
    return true;
  }

  const now = moment();

  const isOpened = now.isSameOrAfter(moment(event.registrationStartDate));
  const isClosed = now.isAfter(moment(event.registrationEndDate));

  return isOpened && !isClosed;
};

export default () => async (hook: IlmoHookContext<Signup>) => {
  const { quotaId } = hook.data!;

  if (!Number.isSafeInteger(quotaId)) {
    throw new Error('Missing quota id.');
  }

  const quota = await Quota.findByPk(quotaId, {
    attributes: [],
    include: [
      {
        model: Event as typeof Model,
        attributes: ['registrationStartDate', 'registrationEndDate'],
      },
    ],
  });
  if (quota === null) {
    throw new Error('Quota doesn\'t exist.');
  }

  if (!signupsAllowed(quota.event!)) {
    throw new Error('Signups closed for this event.');
  }

  // Remove any other fields from signup.
  hook.data = { quotaId } /* TODO */ as any;
  return hook;
};
