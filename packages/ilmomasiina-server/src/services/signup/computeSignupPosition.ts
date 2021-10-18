import moment from 'moment';
import { Transaction, WhereOptions } from 'sequelize';

import { SignupStatus } from '@tietokilta/ilmomasiina-api/src/models/signup';
import EmailService from '../../mail';
import { Event } from '../../models/event';
import { Quota } from '../../models/quota';
import { Signup } from '../../models/signup';

async function sendPromotedFromQueueEmail(signup: Signup, eventId: Event['id']) {
  if (signup.email === null) return;

  // Re-fetch event for all attributes
  const event = await Event.unscoped().findByPk(eventId);
  if (event === null) throw new Error('event missing when sending queue email');

  const params = {
    event,
    date: event.date && moment(event.date).tz('Europe/Helsinki').format('DD.MM.YYYY HH:mm'),
  };
  EmailService.sendPromotedFromQueueEmail(signup.email, params);
}

/**
 * Updates the status and position attributes on all signups in the given event. Also sends "promoted from queue"
 * emails to affected users. Returns the new statuses for all signups.
 *
 * Make sure that the event passed contains `id`, `openQuotaSize`.
 */
export async function refreshSignupPositions(event: Event, transaction?: Transaction): Promise<Signup[]> {
  // Wrap in transaction if not given
  if (!transaction) {
    return Event.sequelize!.transaction(
      async (trans) => refreshSignupPositions(event, trans),
    );
  }

  const signups = await Signup.scope('active').findAll({
    attributes: ['id', 'quotaId', 'email', 'status', 'position'],
    include: [
      {
        model: Quota,
        attributes: ['id', 'size'],
      },
    ],
    where: {
      '$quota.eventId$': event.id,
    } as WhereOptions,
    // Honor creation time, tie-break by random ID in case of same millisecond
    order: [
      ['createdAt', 'ASC'],
      ['id', 'ASC'],
    ],
    // Prevent simultaneous changes
    lock: Transaction.LOCK.UPDATE,
    transaction,
  });

  // Assign each signup to a quota or the queue.
  const quotaSignups = new Map<Quota['id'], number>();
  let inOpenQuota = 0;
  let inQueue = 0;

  const result = signups.map((signup: Signup) => {
    let status: SignupStatus;
    let position: number;

    let inChosenQuota = quotaSignups.get(signup.quotaId) ?? 0;
    const chosenQuotaSize = signup.quota!.size ?? Infinity;

    // Assign the selected or open quotas if free. Never worsen a signup's status.
    if (signup.status === 'in-quota' || inChosenQuota < chosenQuotaSize) {
      inChosenQuota += 1;
      quotaSignups.set(signup.quotaId, inChosenQuota);
      status = 'in-quota';
      position = inChosenQuota;
    } else if (signup.status === 'in-open' || inOpenQuota < event.openQuotaSize) {
      inOpenQuota += 1;
      status = 'in-open';
      position = inOpenQuota;
    } else {
      inQueue += 1;
      status = 'in-queue';
      position = inQueue;
    }

    return { signup, status, position };
  });

  // If a signup was just promoted from the queue, send an email about it asynchronously.
  result.forEach(({ signup, status }) => {
    if (signup.status === 'in-queue' && status !== 'in-queue') {
      sendPromotedFromQueueEmail(signup, event.id);
    }
  });

  // Store changes in database, if any.
  await Promise.all(result.map(async ({ signup, status, position }) => {
    if (signup.status !== status || signup.position !== position) {
      await signup.update(
        { status, position },
        { transaction },
      );
    }
  }));

  return result.map(({ signup }) => signup);
}

/**
 * Like `refreshSignupPositions`, but returns the status for the given signup.
 */
export async function refreshSignupPositionsAndGet(event: Event, signupId: Signup['id']) {
  const result = await refreshSignupPositions(event);
  const signup = result.find(({ id }) => id === signupId);
  if (!signup) throw new Error('failed to compute status');
  const { status, position } = signup;
  return { status, position };
}
