import { Params } from '@feathersjs/feathers';
import _ from 'lodash';

import {
  AdminEventCreateBody,
  adminEventCreateEventAttrs,
  adminEventCreateQuestionAttrs,
  adminEventCreateQuotaAttrs,
} from '@tietokilta/ilmomasiina-models/dist/services/admin/events/create';
import { AdminEventGetResponse } from '@tietokilta/ilmomasiina-models/dist/services/events/details';
import { Event } from '../../../models/event';
import { Question } from '../../../models/question';
import { Quota } from '../../../models/quota';
import { logEvent } from '../../../util/auditLog';
import { getEventDetailsForAdmin } from '../../event/getEventDetails';

export default async (data: AdminEventCreateBody, params: Params | undefined): Promise<AdminEventGetResponse> => {
  // Pick only allowed attributes and add order
  const attribs = {
    ..._.pick(data, adminEventCreateEventAttrs),
    questions: data.questions?.map((question, order) => ({
      ..._.pick(question, adminEventCreateQuestionAttrs),
      order,
    })),
    quotas: data.quotas?.map((quota, order) => ({
      ..._.pick(quota, adminEventCreateQuotaAttrs),
      order,
    })),
  };

  // Create the event with relations - Sequelize will handle validation
  const event = await Event.sequelize!.transaction(async (transaction) => {
    const created = await Event.create(attribs, {
      transaction,
      include: [
        {
          model: Question,
          required: false,
        },
        {
          model: Quota,
          required: false,
        },
      ],
    });

    await logEvent('event.create', { event: created, params, transaction });

    return created;
  });

  return getEventDetailsForAdmin(event.id);
};
