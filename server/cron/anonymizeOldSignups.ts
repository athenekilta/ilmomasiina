import _ from 'lodash';
import moment from 'moment';
import { Op } from 'sequelize';

import { Signup } from '../models/signup';

const redactedName = 'Deleted';
const redactedEmail = 'deleted@gdpr';

export default async function () {
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
        // Only anonymize 6 months old signups
        // TODO: make the time configurable, or maybe dependent on event date
        createdAt: {
          [Op.lt]: moment().subtract(6, 'months').toDate(),
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

  const ids = _.map(signups, 'id');

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
