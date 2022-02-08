import debug from 'debug';
import moment from 'moment';
import { Op } from 'sequelize';

import config from '../config';
import { Answer } from '../models/answer';
import { Event } from '../models/event';
import { Quota } from '../models/quota';
import { Signup } from '../models/signup';

const redactedName = 'Deleted';
const redactedEmail = 'deleted@gdpr.invalid';
const redactedAnswer = 'Deleted';

const debugLog = debug('app:cron:anonymize');

export default async function anonymizeOldSignups() {
  const redactOlderThan = moment().subtract(config.anonymizeAfterDays, 'days').toDate();

  const signups = await Signup.findAll({
    include: [
      {
        model: Quota,
        attributes: [],
        include: [
          {
            model: Event,
            attributes: [],
          },
        ],
      },
    ],
    where: {
      [Op.and]: [
        {
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
        },
        {
          [Op.or]: {
            // Only anonymize if the event was long enough ago
            '$quota.event.date$': {
              [Op.lt]: redactOlderThan,
            },
            // Or the event has no date and the signup closed long enough ago
            [Op.and]: {
              '$quota.event.date$': {
                [Op.eq]: null,
              },
              '$quota.event.registrationEndDate$': {
                [Op.lt]: redactOlderThan,
              },
            },
          },
        },
        {
          // Don't touch unconfirmed signups
          confirmedAt: {
            [Op.not]: null,
          },
        },
      ],
    },
  });
  if (signups.length === 0) {
    debugLog('No old signups to redact');
    return;
  }

  const ids = signups.map((signup) => signup.id);

  console.info(`Redacting older signups: ${ids.join(', ')}`);
  try {
    await Signup.update({
      firstName: redactedName,
      lastName: redactedName,
      email: redactedEmail,
    }, {
      where: { id: ids },
    });
    await Answer.update({
      answer: redactedAnswer,
    }, {
      where: { signupId: ids },
    });
    debugLog('Signups anonymized');
  } catch (error) {
    console.error(error);
  }
}
