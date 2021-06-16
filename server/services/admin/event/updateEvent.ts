import { BadRequest, NotFound } from '@feathersjs/errors';
import _ from 'lodash';
import { Op, Transaction } from 'sequelize';
import { Event } from '../../../models/event';
import { Question } from '../../../models/question';
import { Quota } from '../../../models/quota';
import getEventDetails from '../../event/getEventDetails';
import { adminEventCreateEventAttrs, adminEventCreateQuestionAttrs, adminEventCreateQuotaAttrs } from './createEvent';

// Data type definitions for the request body, using attribute lists from createEvent.
export interface AdminEventUpdateQuestion extends Pick<Question, typeof adminEventCreateQuestionAttrs[number]> {
  id?: number;
}

export interface AdminEventUpdateQuota extends Pick<Quota, typeof adminEventCreateQuotaAttrs[number]> {
  id?: number;
}

export interface AdminEventUpdateBody extends Pick<Event, typeof adminEventCreateEventAttrs[number]> {
  questions: AdminEventUpdateQuestion[];
  // intentionally misnamed to match old API
  quota: AdminEventUpdateQuota[];
}

export default async (id: number, data: Partial<AdminEventUpdateBody>) => {
  if (!Number.isSafeInteger(id)) {
    throw new BadRequest('Invalid id');
  }

  await Event.sequelize!.transaction(async (transaction) => {
    // Get the event with all relevant information for the update
    const event = await Event.unscoped().findByPk(id, {
      attributes: ['id'],
      include: [
        // Get existing quota and question IDs to reuse them wherever possible
        {
          model: Quota,
          required: false,
          attributes: [
            'id',
            /* // TODO: count signups to see if we're deleting any, possibly with explicit synced confirmation
            [fn('COUNT', col('quotas->signups.id')), 'signupCount'], */
          ],
          /* include: [
            {
              model: Signup,
              required: false,
              attributes: [],
            },
          ], */
        },
        {
          model: Question,
          required: false,
          attributes: ['id'],
        },
      ],
      transaction,
      lock: Transaction.LOCK.SHARE,
    });
    if (event === null) {
      throw new NotFound('No event found with id');
    }

    // Update the Event
    const eventAttribs = _.pick(data, adminEventCreateEventAttrs);
    await event.update(eventAttribs, { transaction });

    if (data.questions !== undefined) {
      // Remove previous Questions not present in request
      // (TODO: require confirmation if there are signups)
      const oldQuestions = await event.getQuestions({
        attributes: ['id'],
        transaction,
      });
      const newIds = data.questions.map((question) => question.id).filter((newId) => newId) as number[];
      await Question.destroy({
        where: {
          id: {
            [Op.notIn]: newIds,
          },
        },
        transaction,
      });
      // Update the Questions
      await Promise.all(data.questions.map(async (question) => {
        const questionAttribs = _.pick(question, adminEventCreateQuestionAttrs);
        // See if the question already exists
        const existing = question.id && oldQuestions.find((old) => old.id === question.id);
        if (existing) {
          await existing.update(questionAttribs, { transaction });
        } else {
          await Question.create({
            ...questionAttribs,
            eventId: event.id,
          }, { transaction });
        }
      }));
    }

    if (data.quota !== undefined) {
      // Remove previous Quotas not present in request
      // (TODO: require confirmation if there are signups)
      const oldQuotas = await event.getQuotas({
        attributes: ['id'],
        transaction,
      });
      const newIds = data.quota.map((quota) => quota.id).filter((newId) => newId) as number[];
      await Quota.destroy({
        where: {
          id: {
            [Op.notIn]: newIds,
          },
        },
        transaction,
      });
      // Update the Quotas
      await Promise.all(data.quota.map(async (quota) => {
        const quotaAttribs = _.pick(quota, adminEventCreateQuotaAttrs);
        // See if the quota already exists
        const existing = quota.id && oldQuotas.find((old) => old.id === quota.id);
        if (existing) {
          await existing.update(quotaAttribs, { transaction });
        } else {
          await Quota.create({
            ...quotaAttribs,
            eventId: event.id,
          }, { transaction });
        }
      }));
    }
  });

  return getEventDetails(id, true);
};
