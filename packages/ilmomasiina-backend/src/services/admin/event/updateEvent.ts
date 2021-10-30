import { NotFound } from '@feathersjs/errors';
import _ from 'lodash';
import { Op, Transaction } from 'sequelize';

import {
  adminEventCreateEventAttrs,
  adminEventCreateQuestionAttrs,
  adminEventCreateQuotaAttrs,
} from '@tietokilta/ilmomasiina-models/src/services/admin/events/create';
import { AdminEventUpdateBody } from '@tietokilta/ilmomasiina-models/src/services/admin/events/update';
import { AdminEventGetResponse } from '@tietokilta/ilmomasiina-models/src/services/events/details';
import { Event } from '../../../models/event';
import { Question } from '../../../models/question';
import { Quota } from '../../../models/quota';
import { getEventDetailsForAdmin } from '../../event/getEventDetails';
import { refreshSignupPositions } from '../../signup/computeSignupPosition';
import { EditConflict } from './errors';

export default async (id: Event['id'], data: Partial<AdminEventUpdateBody>): Promise<AdminEventGetResponse> => {
  await Event.sequelize!.transaction(async (transaction) => {
    // Get the event with all relevant information for the update
    const event = await Event.findByPk(id, {
      attributes: ['id', 'openQuotaSize'],
      include: [
        // Get existing quota and question IDs to reuse them wherever possible
        {
          model: Quota,
          required: false,
          attributes: ['id'],
        },
        {
          model: Question,
          required: false,
          attributes: ['id'],
        },
      ],
      transaction,
      lock: Transaction.LOCK.UPDATE,
    });
    if (event === null) {
      throw new NotFound('No event found with id');
    }

    // Track already-deleted questions and quotas
    // This could be checked beforehand to avoid extra DB access,
    // but it's a rare edge case so the performance is not an issue
    const deletedQuestions: Question['id'][] = [];
    const deletedQuotas: Quota['id'][] = [];

    // Update the Event
    const eventAttribs = _.pick(data, adminEventCreateEventAttrs);
    await event.update(eventAttribs, { transaction });

    if (data.questions !== undefined) {
      const reuseQuestionIds = data.questions
        .map((question) => question.id)
        .filter((questionId) => questionId) as Question['id'][];

      // Remove previous Questions not present in request
      await Question.destroy({
        where: {
          eventId: event.id,
          id: {
            [Op.notIn]: reuseQuestionIds,
          },
        },
        transaction,
      });

      // Update or create the new Questions
      await Promise.all(data.questions.map(async (question, order) => {
        const questionAttribs = {
          ..._.pick(question, adminEventCreateQuestionAttrs),
          order,
        };
        // Update if an id was provided
        if (question.id) {
          const existing = event.questions!.find((old) => question.id === old.id);
          if (!existing) {
            deletedQuestions.push(question.id);
            return;
          }
          await existing.update(questionAttribs, { transaction });
        } else {
          await Question.create({
            ...questionAttribs,
            eventId: event.id,
          }, { transaction });
        }
      }));
    }

    if (data.quotas !== undefined) {
      const reuseQuotaIds = data.quotas
        .map((quota) => quota.id)
        .filter((quotaId) => quotaId) as Quota['id'][];

      // Remove previous Quotas not present in request
      await Quota.destroy({
        where: {
          eventId: event.id,
          id: {
            [Op.notIn]: reuseQuotaIds,
          },
        },
        transaction,
      });

      // Update or create the new Quotas
      await Promise.all(data.quotas.map(async (quota, order) => {
        const quotaAttribs = {
          ..._.pick(quota, adminEventCreateQuotaAttrs),
          order,
        };
        // Update if an id was provided
        if (quota.id) {
          const existing = event.quotas!.find((old) => quota.id === old.id);
          if (!existing) {
            deletedQuotas.push(quota.id);
            return;
          }
          await existing.update(quotaAttribs, { transaction });
        } else {
          await Quota.create({
            ...quotaAttribs,
            eventId: event.id,
          }, { transaction });
        }
      }));
    }

    if (deletedQuestions.length || deletedQuotas.length) {
      throw new EditConflict(deletedQuotas, deletedQuestions);
    }

    // Refresh positions, but don't move signups to queue unless explicitly allowed
    await refreshSignupPositions(event, transaction, Boolean(data.moveSignupsToQueue));
  });

  return getEventDetailsForAdmin(id);
};
