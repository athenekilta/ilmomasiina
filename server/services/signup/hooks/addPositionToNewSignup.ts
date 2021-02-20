import _ from 'lodash';
import { col, fn, Model, Op } from 'sequelize';
import { IlmoHookContext } from '../../../defs';
import { Quota } from '../../../models/quota';
import { Signup } from '../../../models/signup';

type SignupState = 'in-quota' | 'in-open' | 'in-queue';

interface SignupServiceCreateResult {
  id: number;
  position: number | null;
  status: SignupState | null;
  quotaId: number;
  createdAt: Date;
}

export default () => async (hook: IlmoHookContext<Signup | SignupServiceCreateResult>) => {
  const signup = hook.result! as Signup;
  const currentQuota = await signup.getQuota()!;

  const event = await currentQuota.getEvent({
    attributes: ['id', 'openQuotaSize', 'signupsPublic'],
    // Include all quotas for the event
    include: [{
      model: Quota as typeof Model,
      attributes: [
        'id',
        'size',
        // Count all signups for each quota
        [fn('COUNT', col('quota->signups.id')), 'signupsBefore'],
      ],
      include: [{
        model: Signup as typeof Model,
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
    group: [col('event.id'), col('quota.id')],
  });
  const positionInQuota = _.find(event.quotas!, { id: currentQuota.id })!.signupsBefore;

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
      const positionInOpen = _.sum(event.quotas!.map((quota) => Math.max(0, quota.signupsBefore - quota.size)));

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

  hook.result = {
    id: signup.id, // signup id
    position,
    status,
    quotaId: currentQuota.id,
    createdAt: signup.createdAt,
  };
};
