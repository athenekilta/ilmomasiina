import moment from 'moment';
import { Op, fn, col } from 'sequelize';
import { IlmoHookContext } from '../../../defs';
import { Event } from '../../../models/event';
import { Quota } from '../../../models/quota';
import { Signup } from '../../../models/signup';

export default () => (hook: IlmoHookContext<Event>) => {
  hook.params.sequelize = {
    attributes: [
      'id',
      'title',
      'date',
      'registrationStartDate',
      'registrationEndDate',
      'openQuotaSize',
      'signupsPublic',
    ],
    distinct: true,
    raw: false,
    // Filter out events that are saved as draft
    where: {
      draft: 0,
      date: {
        [Op.gt]: moment().subtract(1, 'days').toDate(),
      },
    },
    // Include quotas of event and count of signups
    include: [
      {
        model: Quota,
        attributes: [
          'title',
          'size',
          [fn('COUNT', col('quota->signups.id')), 'signupCount'],
        ],
        include: [
          {
            model: Signup,
            required: false,
            attributes: [],
          },
        ],
      },
    ],
    group: [col('event.id'), col('quota.id')],
  };
};
