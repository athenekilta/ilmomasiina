/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import { AdapterService } from '@feathersjs/adapter-commons';
import { hooks as authHooks } from '@feathersjs/authentication';
import { MethodNotAllowed } from '@feathersjs/errors';
import { Id } from '@feathersjs/feathers';

import { IlmoApplication } from '../../../defs';
import getEventDetails, { EventGetResponse } from '../../event/getEventDetails';
import getEventsList, { EventListResponse } from '../../event/getEventsList';
import createEvent, { AdminEventCreateBody } from './createEvent';
import deleteEvent from './deleteEvent';
import updateEvent, { AdminEventUpdateBody } from './updateEvent';

type AdminEventsServiceResponses = EventListResponse | EventGetResponse;

export class AdminEventsService extends AdapterService<AdminEventsServiceResponses> {
  _find() {
    return getEventsList(true);
  }

  _get(id: Id) {
    return getEventDetails(Number(id), true);
  }

  _create(data: AdminEventCreateBody) {
    return createEvent(data);
  }

  _update(): never {
    throw new MethodNotAllowed('Cannot PUT /api/admin/events/ID');
  }

  _patch(id: Id, data: Partial<AdminEventUpdateBody>) {
    return updateEvent(Number(id), data);
  }

  _remove(id: Id) {
    return deleteEvent(Number(id));
  }
}

export default function (this: IlmoApplication) {
  const app = this;

  app.use('/api/admin/events', new AdminEventsService({}));

  app.service('/api/admin/events').hooks({
    before: {
      all: [authHooks.authenticate('jwt')],
    },
  });
}
