import _ from 'lodash';
import moment from 'moment';
import { Op } from 'sequelize';

import { Signup } from '../models/signup';

const redactedName = 'Deleted';
const redactedEmail = 'deleted@gdpr';

export default async function anonymizeOldSignups() {
  // TODO: make the time configurable, or maybe dependent on event date
  const redactOlderThan = moment().subtract(6, 'months').toDate();

  const signups = await Signup.findAll({
    where: {
      [Op.and]: {
        // Only anonymize if name and email aren't anonymized already
        [Op.or]: {
          firstName: {
            [Op.ne]: redactedName,
          },
          lastName: {
            [Op.ne]: redactedName,
          },
          email: {
            [Op.ne]: redactedEmail,
          },
        },
        // Only anonymize old enough signups
        createdAt: {
          [Op.lt]: redactOlderThan,
        },
        // Don't touch unconfirmed signups
        confirmedAt: {
          [Op.not]: null,
        },
      },
    },
  });
  if (signups.length === 0) {
    return;
  }

  const ids = signups.map((signup) => signup.id);

  console.log('Redacting older signups:');
  console.log(ids);

  try {
    await Signup.unscoped().update({
      firstName: redactedName,
      lastName: redactedName,
      email: redactedEmail,
    }, {
      where: { id: ids },
    });
    console.log('Signups anonymized');
  } catch (error) {
    console.error(error);
  }
}
