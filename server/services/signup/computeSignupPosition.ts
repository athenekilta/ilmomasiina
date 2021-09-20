import _ from 'lodash';
import { col, fn, Op } from 'sequelize';

import { Quota } from '../../models/quota';
import { Signup } from '../../models/signup';
import { SignupState } from './createNewSignup';

export default async (signup: Signup) => {
  const currentQuota = await signup.getQuota()!;

  const event = await currentQuota.getEvent({
    attributes: ['id', 'openQuotaSize', 'signupsPublic'],
    // Include all quotas for the event
    include: [{
      model: Quota,
      attributes: [
        'id',
        'size',
        // Count all signups for each quota
        [fn('COUNT', col('quotas->signups.id')), 'signupCount'],
      ],
      include: [{
        model: Signup,
        attributes: [],
        where: {
          // Only include this signup and ones older than it.
          createdAt: {
            // TODO: will this fail if there are signups on the same millisecond?
            [Op.lte]: signup.createdAt,
          },
        },
      }],
    }],
    group: [col('event.id'), col('quotas.id')],
  });
  const positionInQuota = _.find(event.quotas!, { id: currentQuota.id })!.signupCount!;

  let position = null;
  let status: SignupState | null = null;

  if (event.signupsPublic) {
    if (currentQuota.size === null || positionInQuota <= currentQuota.size) {
      // Fits in the selected quota or the selected quota is unlimited.
      position = positionInQuota;
      status = 'in-quota';
    } else {
      // Count how many signups (older than this one) don't fit each quota.
      // This is our position in the open quota.
      const positionInOpen = _.sumBy(
        event.quotas!,
        (quota) => (quota.size ? Math.max(0, quota.signupCount! - quota.size) : 0),
      );

      if (positionInOpen <= event.openQuotaSize && event.openQuotaSize > 0) {
        position = positionInOpen;
        status = 'in-open';
      } else {
        const positionInQueue = Math.max(0, positionInOpen - Number(event.openQuotaSize));
        position = positionInQueue;
        status = 'in-queue';
      }
    }
  }

  return {
    position,
    status,
  };
};
