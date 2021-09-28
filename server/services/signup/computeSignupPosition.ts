import moment from 'moment';
import { Transaction, WhereOptions } from 'sequelize';

import EmailService from '../../mail';
import { Event } from '../../models/event';
import { Quota } from '../../models/quota';
import { Signup, SignupStatus } from '../../models/signup';

export type SignupPositionStatus = {
  status: SignupStatus;
  position: number;
};

async function sendPromotedFromQueueEmail(signup: Signup, eventId: Event['id']) {
  if (signup.email === null) return;

  // Re-fetch event for all attributes
  const event = await Event.findByPk(eventId);
  if (event === null) throw new Error('event missing when sending queue email');

  const params = {
    event,
    date: moment(event.date).tz('Europe/Helsinki').format('DD.MM.YYYY HH:mm'),
  };
  EmailService.sendPromotedFromQueueEmail(signup.email, params);
}

/**
 * Updates the status and position attributes on all signups in the given event. Also sends "promoted from queue"
 * emails to affected users. Returns the new statuses for all signups.
 *
 * Make sure that the event passed contains `id`, `openQuotaSize`.
 */
export function refreshSignupPositions(event: Event): Promise<Map<Signup['id'], SignupPositionStatus>> {
  return Event.sequelize!.transaction(async (transaction) => {
    const signups = await Signup.findAll({
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

    const quotaSignups = new Map<Quota['id'], number>();
    let inOpenQuota = 0;
    let inQueue = 0;

    const result = await Promise.all(signups.map(async (signup: Signup) => {
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

      // If the signup was just promoted from the queue, send an email about it asynchronously.
      if (signup.status === 'in-queue' && status !== 'in-queue') {
        sendPromotedFromQueueEmail(signup, event.id);
      }

      // Store changes in database, if any
      if (signup.status !== status || signup.position !== position) {
        await signup.update(
          { status, position },
          { transaction },
        );
      }

      return <const>[signup.id, { status, position }];
    }));

    return new Map(result);
  });
}

/**
 * Like `refreshSignupPositions`, but returns the status for the given signup.
 */
export async function refreshSignupPositionsAndGet(event: Event, signupId: Signup['id']) {
  const positionMap = await refreshSignupPositions(event);
  const position = positionMap.get(signupId);
  if (!position) throw new Error('failed to compute status');
  return position;
}
