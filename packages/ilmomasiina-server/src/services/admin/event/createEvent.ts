import _ from 'lodash';

import {
  AdminEventCreateBody,
  adminEventCreateEventAttrs,
  adminEventCreateQuestionAttrs,
  adminEventCreateQuotaAttrs,
} from '@tietokilta/ilmomasiina-api/src/services/admin/events/create';
import { AdminEventGetResponse } from '@tietokilta/ilmomasiina-api/src/services/events/details';
import { Event } from '../../../models/event';
import { Question } from '../../../models/question';
import { Quota } from '../../../models/quota';
import { getEventDetailsForAdmin } from '../../event/getEventDetails';

export default async (data: AdminEventCreateBody): Promise<AdminEventGetResponse> => {
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
  const event = await Event.sequelize!.transaction((transaction) => (
    Event.create(attribs, {
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
    })
  ));

  return getEventDetailsForAdmin(event.id);
};
