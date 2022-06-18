import { NotFound } from '@feathersjs/errors';
import { Params } from '@feathersjs/feathers';
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
import { logEvent } from '../../../util/auditLog';
import { getEventDetailsForAdmin } from '../../event/getEventDetails';
import { refreshSignupPositions } from '../../signup/computeSignupPosition';
import { EditConflict } from './errors';

export default async (
  id: Event['id'],
  data: Partial<AdminEventUpdateBody>,
  params: Params | undefined,
): Promise<AdminEventGetResponse> => {
  await Event.sequelize!.transaction(async (transaction) => {
    // Get the event with all relevant information for the update
    const event = await Event.findByPk(id, {
      attributes: ['id', 'openQuotaSize', 'draft', 'updatedAt'],
      transaction,
      lock: Transaction.LOCK.UPDATE,
    });
    if (event === null) {
      throw new NotFound('No event found with id');
    }
    // Postgres doesn't support FOR UPDATE with LEFT JOIN
    event.quotas = await Quota.findAll({
      where: { eventId: event.id },
      attributes: ['id'],
      transaction,
      lock: Transaction.LOCK.UPDATE,
    });
    event.questions = await Question.findAll({
      where: { eventId: event.id },
      attributes: ['id'],
      transaction,
      lock: Transaction.LOCK.UPDATE,
    });

    // Find existing questions and quotas for requested IDs
    const updatedQuestions = data.questions?.map((question) => ({
      ...question,
      existing: question.id ? event.questions!.find((old) => question.id === old.id) : undefined,
    }));
    const updatedQuotas = data.quotas?.map((quota) => ({
      ...quota,
      existing: quota.id ? event.quotas!.find((old) => quota.id === old.id) : undefined,
    }));

    // Find questions and quotas that were requested by ID but don't exist
    const deletedQuestions = updatedQuestions
      ?.filter((question) => !question.existing && question.id)
      .map((question) => question.id as Question['id'])
      ?? [];
    const deletedQuotas = updatedQuotas
      ?.filter((quota) => !quota.existing && quota.id)
      .map((quota) => quota.id as Quota['id'])
      ?? [];

    // Check for edit conflicts
    const expectedUpdatedAt = new Date(data.updatedAt ?? '');
    if (
      event.updatedAt.getTime() !== expectedUpdatedAt.getTime()
      || deletedQuestions.length
      || deletedQuotas.length
    ) {
      throw new EditConflict(event.updatedAt, deletedQuotas, deletedQuestions);
    }

    // Update the Event
    const wasPublic = !event.draft;
    const eventAttribs = _.pick(data, adminEventCreateEventAttrs);
    await event.update(eventAttribs, { transaction });

    if (updatedQuestions !== undefined) {
      const reuseQuestionIds = updatedQuestions
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
      await Promise.all(updatedQuestions.map(async (question, order) => {
        const questionAttribs = {
          ..._.pick(question, adminEventCreateQuestionAttrs),
          order,
        };
        // Update if an id was provided
        if (question.existing) {
          await question.existing.update(questionAttribs, { transaction });
        } else {
          await Question.create({
            ...questionAttribs,
            eventId: event.id,
          }, { transaction });
        }
      }));
    }

    if (updatedQuotas !== undefined) {
      const reuseQuotaIds = updatedQuotas
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
      await Promise.all(updatedQuotas.map(async (quota, order) => {
        const quotaAttribs = {
          ..._.pick(quota, adminEventCreateQuotaAttrs),
          order,
        };
        // Update if an id was provided
        if (quota.existing) {
          await quota.existing.update(quotaAttribs, { transaction });
        } else {
          await Quota.create({
            ...quotaAttribs,
            eventId: event.id,
          }, { transaction });
        }
      }));
    }

    // Refresh positions, but don't move signups to queue unless explicitly allowed
    await refreshSignupPositions(event, transaction, Boolean(data.moveSignupsToQueue));

    const isPublic = !event.draft;
    let action;
    if (isPublic === wasPublic) action = 'event.edit';
    else action = isPublic ? 'event.publish' : 'event.unpublish';

    await logEvent(action, { event, params, transaction });
  });

  return getEventDetailsForAdmin(id);
};
