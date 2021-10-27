import _ from 'lodash';
import moment from 'moment';
import { Op } from 'sequelize';

import { Event } from '../models/event';
import { Quota } from '../models/quota';
import { Signup } from '../models/signup';
import { refreshSignupPositions } from '../services/signup/computeSignupPosition';

export default async function deleteUnconfirmedSignups() {
  const signups = await Signup.findAll({
    where: {
      [Op.and]: {
        // Is not confirmed
        confirmedAt: {
          [Op.eq]: null,
        },
        // Over 30 minutes old
        createdAt: {
          [Op.lt]: moment().subtract(30, 'minutes').toDate(),
        },
      },
    },
    include: [
      {
        model: Quota,
        attributes: ['id'],
        include: [
          {
            model: Event.unscoped(),
            attributes: ['id', 'openQuotaSize'],
          },
        ],
      },
    ],
    // Also already-deleted signups
    paranoid: false,
  });

  if (signups.length === 0) {
    console.log('No unconfirmed signups to delete');
    return;
  }

  const signupIds = signups.map((signup) => signup.id);
  const uniqueEvents = _.uniqBy(signups.map((signup) => signup.quota!.event!), 'id');

  console.log('Deleting unconfirmed signups:');
  console.log(signupIds);
  try {
    await Signup.destroy({
      where: { id: signupIds },
      // skip deletion grace period
      force: true,
    });
    for (const event of uniqueEvents) {
      // Avoid doing many simultaneous transactions with this loop.
      // eslint-disable-next-line no-await-in-loop
      await refreshSignupPositions(event);
    }
    console.log('Unconfirmed signups deleted');
  } catch (error) {
    console.error(error);
  }
}
